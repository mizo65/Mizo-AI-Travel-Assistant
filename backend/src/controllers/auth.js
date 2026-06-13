import { db, firebaseHelpers, auth } from '../config/firebase.js';
import { hashPassword, comparePassword, generateToken, generateRefreshToken } from '../middleware/index.js';
import { registerValidation, loginValidation } from '../utils/validation.js';
import jwt from 'jsonwebtoken';

// Register Controller
export const register = async (req, res) => {
  try {
    const { error, value } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: 'البيانات المدخلة غير صحيحة',
        errors: error.details.map(d => d.message)
      });
    }

    const { fullName, email, phone, password, passport, role } = value;

    // Check if email already exists
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
    
    if (snapshot.exists()) {
      return res.status(400).json({
        status: false,
        message: 'البريد الإلكتروني مستخدم من قبل 📧'
      });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName
    });

    // Hash password for database
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const userData = {
      fullName,
      email,
      phone,
      passport: passport || '',
      passwordHash: hashedPassword,
      role: role || 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.ref(`users/${userRecord.uid}`).set(userData);

    // Generate tokens
    const token = generateToken(userRecord.uid, userData.role);
    const refreshToken = generateRefreshToken(userRecord.uid);

    res.status(201).json({
      status: true,
      message: 'تم التسجيل بنجاح ✅',
      data: {
        userId: userRecord.uid,
        token,
        refreshToken,
        user: {
          fullName,
          email,
          phone,
          role: userData.role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: false,
      message: 'حدث خطأ في التسجيل 😕',
      error: error.message
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: 'البيانات المدخلة غير صحيحة'
      });
    }

    const { email, password } = value;

    // Get user by email
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

    if (!snapshot.exists()) {
      return res.status(401).json({
        status: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const userData = Object.values(snapshot.val())[0];
    const userId = Object.keys(snapshot.val())[0];

    // Compare passwords
    const passwordMatch = await comparePassword(password, userData.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Generate tokens
    const token = generateToken(userId, userData.role);
    const refreshToken = generateRefreshToken(userId);

    res.json({
      status: true,
      message: 'تم تسجيل الدخول بنجاح ✅',
      data: {
        userId,
        token,
        refreshToken,
        user: {
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: false,
      message: 'حدث خطأ في تسجيل الدخول 😕'
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.json({
      status: true,
      message: 'تم تسجيل الخروج بنجاح ✅'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في تسجيل الخروج'
    });
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: 'رمز التحديث مطلوب'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Get user data
    const userSnapshot = await db.ref(`users/${decoded.userId}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(401).json({
        status: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Generate new token
    const newToken = generateToken(decoded.userId, userData.role);

    res.json({
      status: true,
      message: 'تم تجديد الرمز بنجاح ✅',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: 'رمز التحديث غير صحيح أو منتهي'
    });
  }
};

export default {
  register,
  login,
  logout,
  refreshToken
};
import { db, firebaseHelpers } from '../config/firebase.js';
import { userUpdateValidation } from '../utils/validation.js';

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const userSnapshot = await db.ref(`users/${userId}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({
        status: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Remove sensitive data
    delete userData.passwordHash;

    res.json({
      status: true,
      message: 'تم جلب البيانات بنجاح ✅',
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في جلب البيانات'
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { error, value } = userUpdateValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: 'البيانات المدخلة غير صحيحة',
        errors: error.details.map(d => d.message)
      });
    }

    const updates = {
      ...value,
      updatedAt: new Date().toISOString()
    };

    await firebaseHelpers.updateUser(userId, updates);

    res.json({
      status: true,
      message: 'تم تحديث البيانات بنجاح ✅',
      data: updates
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في تحديث البيانات'
    });
  }
};

// Get User Trips
export const getTrips = async (req, res) => {
  try {
    const userId = req.userId;

    const bookingsSnapshot = await db.ref('bookings')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const bookings = bookingsSnapshot.val() || {};

    const trips = [];
    for (const [bookingId, booking] of Object.entries(bookings)) {
      const tripSnapshot = await db.ref(`trips/${booking.tripId}`).once('value');
      const tripData = tripSnapshot.val();
      if (tripData) {
        trips.push({
          bookingId,
          ...tripData
        });
      }
    }

    res.json({
      status: true,
      message: 'تم جلب الرحلات بنجاح ✅',
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في جلب الرحلات'
    });
  }
};

// Get User Bookings
export const getBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookingsSnapshot = await db.ref('bookings')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const bookings = bookingsSnapshot.val() || {};

    res.json({
      status: true,
      message: 'تم جلب الحجوزات بنجاح ✅',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في جلب الحجوزات'
    });
  }
};

// Get User Payments
export const getPayments = async (req, res) => {
  try {
    const userId = req.userId;

    const paymentsSnapshot = await db.ref('payments')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const payments = paymentsSnapshot.val() || {};

    res.json({
      status: true,
      message: 'تم جلب المدفوعات بنجاح ✅',
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'خطأ في جلب المدفوعات'
    });
  }
};

export default {
  getUserProfile,
  updateProfile,
  getTrips,
  getBookings,
  getPayments
};

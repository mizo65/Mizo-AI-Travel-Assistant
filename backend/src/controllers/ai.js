import { db, firebaseHelpers } from '../config/firebase.js';
import { aiResponses } from '../config/openai.js';

// Process Text Command
export const processTextCommand = async (req, res) => {
  try {
    const userId = req.userId;
    const { command, language = 'ar' } = req.body;

    if (!command) {
      return res.status(400).json({
        status: false,
        message: 'الأمر مطلوب'
      });
    }

    // Parse command using AI
    const parsedCommand = await aiResponses.parseCommand(command, language);

    // Save command to database
    await firebaseHelpers.saveChat(userId, {
      role: 'user',
      content: command,
      type: 'command',
      language,
      parsedAction: parsedCommand.action
    });

    // Execute command based on action
    let response = {};
    if (parsedCommand.action === 'create_client') {
      response = await executeCreateClientCommand(parsedCommand.parameters);
    } else if (parsedCommand.action === 'create_trip') {
      response = await executeCreateTripCommand(parsedCommand.parameters);
    } else if (parsedCommand.action === 'update_booking') {
      response = await executeUpdateBookingCommand(parsedCommand.parameters);
    }

    // Generate AI response
    const aiResponse = `تم تنفيذ الأمر بنجاح ✅\n${JSON.stringify(response)}`;

    // Save response
    await firebaseHelpers.saveChat(userId, {
      role: 'assistant',
      content: aiResponse,
      type: 'text',
      language
    });

    res.json({
      status: true,
      message: 'تم تنفيذ الأمر بنجاح ✅',
      data: {
        command: parsedCommand,
        response
      }
    });
  } catch (error) {
    console.error('Command error:', error);
    res.status(500).json({
      status: false,
      message: 'خطأ في تنفيذ الأمر'
    });
  }
};

// Process Voice Command
export const processVoiceCommand = async (req, res) => {
  try {
    const userId = req.userId;
    const audioBuffer = req.files?.audio;
    const language = req.body.language || 'ar';

    if (!audioBuffer) {
      return res.status(400).json({
        status: false,
        message: 'ملف الصوت مطلوب'
      });
    }

    // Convert voice to text
    const transcript = await aiResponses.processVoiceInput(audioBuffer.data, language);

    // Parse and execute command
    const parsedCommand = await aiResponses.parseCommand(transcript, language);

    // Execute command
    let response = {};
    if (parsedCommand.action === 'create_client') {
      response = await executeCreateClientCommand(parsedCommand.parameters);
    }

    // Generate voice response
    const responseText = `تم تنفيذ الأمر: ${parsedCommand.action} بنجاح ✅`;
    const voiceResponse = await aiResponses.generateVoiceResponse(responseText, 'nova');

    res.json({
      status: true,
      message: 'تم معالجة الأمر الصوتي بنجاح ✅',
      data: {
        transcript,
        parsedCommand,
        response,
        voiceResponse: voiceResponse.toString('base64')
      }
    });
  } catch (error) {
    console.error('Voice command error:', error);
    res.status(500).json({
      status: false,
      message: 'خطأ في معالجة الأمر الصوتي'
    });
  }
};

// Execute Admin Commands
export const executeAdminCommand = async (req, res) => {
  try {
    const userId = req.userId;
    const { commandType, parameters } = req.body;

    let result = {};

    switch (commandType) {
      case 'create_client':
        result = await executeCreateClientCommand(parameters);
        break;
      case 'create_trip':
        result = await executeCreateTripCommand(parameters);
        break;
      case 'update_booking':
        result = await executeUpdateBookingCommand(parameters);
        break;
      case 'add_payment':
        result = await executeAddPaymentCommand(parameters);
        break;
      default:
        return res.status(400).json({
          status: false,
          message: 'نوع الأمر غير معروف'
        });
    }

    res.json({
      status: true,
      message: 'تم تنفيذ الأمر بنجاح ✅',
      data: result
    });
  } catch (error) {
    console.error('Admin command error:', error);
    res.status(500).json({
      status: false,
      message: 'خطأ في تنفيذ الأمر الإداري'
    });
  }
};

// Helper Functions for Command Execution
async function executeCreateClientCommand(params) {
  try {
    const { fullName, phone, email } = params;

    const userData = {
      fullName,
      phone,
      email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const userRef = db.ref('users').push();
    await userRef.set(userData);

    await firebaseHelpers.logAnalytics('client_created_via_command', {
      clientId: userRef.key,
      fullName
    });

    return {
      success: true,
      userId: userRef.key,
      message: `تم إضافة العميل ${fullName} بنجاح ✅`,
      ...userData
    };
  } catch (error) {
    throw error;
  }
}

async function executeCreateTripCommand(params) {
  try {
    const { country, hotel, airline, date, price, description } = params;

    const tripData = {
      country,
      hotel,
      airline,
      date,
      price,
      description,
      status: 'active',
      availableSeats: 20,
      createdAt: new Date().toISOString()
    };

    const tripId = await firebaseHelpers.createTrip(tripData);

    return {
      success: true,
      tripId,
      message: `تم إنشاء رحلة إلى ${country} بنجاح ✅`,
      ...tripData
    };
  } catch (error) {
    throw error;
  }
}

async function executeUpdateBookingCommand(params) {
  try {
    const { bookingId, status } = params;

    await db.ref(`bookings/${bookingId}`).update({
      status,
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: `تم تحديث الحجز إلى حالة ${status} بنجاح ✅`,
      bookingId,
      status
    };
  } catch (error) {
    throw error;
  }
}

async function executeAddPaymentCommand(params) {
  try {
    const { bookingId, amount, method } = params;

    const paymentData = {
      bookingId,
      amount,
      method,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    const paymentId = await firebaseHelpers.createPayment(paymentData);

    return {
      success: true,
      paymentId,
      message: `تم إضافة دفع بقيمة ${amount} بنجاح ✅`,
      ...paymentData
    };
  } catch (error) {
    throw error;
  }
}

export default {
  processTextCommand,
  processVoiceCommand,
  executeAdminCommand
};

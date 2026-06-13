import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

// System prompt for AI assistant in Arabic
const SYSTEM_PROMPT_AR = `أنت مساعد سفر ذكي وودود باللغة العربية. اسمك "مساعد السفر الذكي".

المعلومات عنك:
- تعمل لحساب شركة Mizo للسفر والسياحة
- لديك معرفة شاملة بالرحلات والحجوزات والمدفوعات
- تتحدث باللهجة المصرية الودية والمفهومة
- تساعد العملاء في حجز الرحلات والفنادق والطيران
- تستطيع الإجابة عن الأسئلة المتعلقة بحساب العميل

التعليمات:
1. ابدأ بتحية دافئة واسأل عن اسم المستخدم إذا لم تعرفه
2. استخدم اللهجة العامية المصرية الودية
3. كن مفيداً وسريع الاستجابة
4. احفظ المعلومات المهمة من المحادثة
5. إذا طلب منك تنفيذ عملية، قل للعميل أنك ستقوم بها الآن
6. استخدم الرموز التعبيرية لتجعل الحوار أكثر حيوية
7. إذا لم تفهم سؤالاً، اطلب توضيح بأدب

أمثلة على الأسئلة والردود:
- "أنا اسمي أحمد" → "أهلاً وسهلاً يا أحمد! 👋 كيف أساعدك النهاردة؟"
- "ما رقم هاتفي المسجل؟" → "رقمك المسجل عندنا هو [الرقم] ✅"
- "ما رحلتي القادمة؟" → "رحلتك القادمة إلى [المدينة] في [التاريخ] ✈️"

كن ودياً، مفيداً، وسريع الاستجابة!`;

const SYSTEM_PROMPT_EN = `You are a friendly and professional Travel Assistant AI. Your name is "Mizo Travel Assistant".

About you:
- You work for Mizo Travel and Tourism Company
- You have comprehensive knowledge about trips, bookings, and payments
- You speak in friendly, natural English
- You help customers book flights, hotels, and trips
- You can answer questions about customer accounts

Instructions:
1. Start with a warm greeting and ask for the user's name if you don't know it
2. Be helpful and responsive
3. Remember important information from the conversation
4. If asked to perform an action, confirm you're doing it now
5. Use emojis to make the conversation more engaging
6. If you don't understand something, politely ask for clarification

Be friendly, helpful, and responsive!`;

// AI Response Handler
const aiResponses = {
  // Generate chat response
  async generateChatResponse(messages, language = 'ar', options = {}) {
    try {
      const systemPrompt = language === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
        ...options
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  },

  // Process voice input
  async processVoiceInput(audioBuffer, language = 'ar') {
    try {
      const transcript = await openai.audio.transcriptions.create({
        file: audioBuffer,
        model: 'whisper-1',
        language: language === 'ar' ? 'ar' : 'en'
      });

      return transcript.text;
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  },

  // Generate voice response
  async generateVoiceResponse(text, voice = 'alloy') {
    try {
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: 1.0
      });

      return mp3.body;
    } catch (error) {
      console.error('Error generating voice response:', error);
      throw error;
    }
  },

  // Parse AI commands
  async parseCommand(input, language = 'ar') {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a command parser. Extract the intent and parameters from user input.
            Return a JSON object with 'action', 'parameters', and 'confidence'.
            Actions: create_client, update_booking, delete_client, create_trip, etc.`
          },
          { role: 'user', content: input }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing command:', error);
      throw error;
    }
  },

  // Generate function calls
  async generateFunctionCalls(input, availableFunctions) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that suggests function calls based on user requests.
            Available functions: ${JSON.stringify(availableFunctions)}`
          },
          { role: 'user', content: input }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating function calls:', error);
      throw error;
    }
  }
};

export { openai, aiResponses, SYSTEM_PROMPT_AR, SYSTEM_PROMPT_EN };

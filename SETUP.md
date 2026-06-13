# 🚀 Setup Guide - Mizo AI Travel Assistant

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase account
- OpenAI API key
- Git

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/mizo65/Mizo-AI-Travel-Assistant.git
cd Mizo-AI-Travel-Assistant
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - Firebase config
# - OpenAI API key
# - JWT secret
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL
```

### 4. Run Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Server will run on http://localhost:3000
```

## 🐳 Docker Setup

### Option 1: Docker Compose

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Individual Containers

```bash
# Build images
docker build -t mizo-backend ./backend
docker build -t mizo-frontend ./frontend

# Run containers
docker run -p 5000:5000 mizo-backend
docker run -p 3000:3000 mizo-frontend
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=your_openai_key
FIREBASE_PROJECT_ID=ai-mizo
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
VITE_OPENAI_KEY=your_openai_key
```

## 🔒 Security Setup

1. Change all default secrets
2. Enable HTTPS in production
3. Set up proper CORS
4. Enable rate limiting
5. Use environment variables for sensitive data
6. Enable Firebase security rules

## 📊 Database Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Create collections: users, chats, trips, bookings, payments
4. Configure security rules
5. Set up backups

## 🤖 AI Setup

1. Get OpenAI API key from https://platform.openai.com
2. Add to backend .env
3. Test API connection
4. Configure rate limits

## ✅ Verification

### Check Backend
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "uptime": 123.45,
  "message": "مساعد السفر الذكي يعمل بكفاءة ✅"
}
```

### Check Frontend
Open http://localhost:3000 in your browser

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Firebase Connection Error
- Verify credentials in .env
- Check Firebase project ID
- Enable Realtime Database
- Check internet connection

### OpenAI API Error
- Verify API key is correct
- Check API usage and limits
- Ensure account has credit

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🚀 Next Steps

1. Create admin account
2. Add sample trips
3. Test chat functionality
4. Enable voice features
5. Deploy to production

---

**Need help?** Check the documentation or open an issue on GitHub!

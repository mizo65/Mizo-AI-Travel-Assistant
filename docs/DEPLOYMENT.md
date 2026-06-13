# Deployment Guide

## 🚀 Deployment Options

### 1. Docker Deployment

#### Build Images
```bash
# Build backend image
docker build -t mizo-travel-backend ./backend

# Build frontend image
docker build -t mizo-travel-frontend ./frontend
```

#### Run with Docker Compose
```bash
docker-compose up -d
```

### 2. Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### 3. AWS Deployment

#### Using EC2
1. Launch EC2 instance (Ubuntu 22.04)
2. Install Node.js and npm
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Use PM2 for process management

```bash
npm install -g pm2
pm2 start npm --name "backend" -- start
pm2 start npm --name "frontend" -- preview
```

### 4. Firebase Hosting

#### Frontend Deployment
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

## 📋 Pre-deployment Checklist

- [ ] Set all environment variables
- [ ] Test all API endpoints
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up SSL certificates

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Update JWT secrets
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Enable CORS with specific origins
- [ ] Implement rate limiting
- [ ] Enable authentication on all endpoints
- [ ] Use environment variables for sensitive data

## 📊 Monitoring

### Using PM2
```bash
pm2 start app.js --name "mizo-travel"
pm2 monitoring
pm2 logs
```

### Using Sentry
```bash
npm install @sentry/node
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: npm run deploy
```

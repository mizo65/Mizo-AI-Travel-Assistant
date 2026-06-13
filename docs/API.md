# API Documentation

## 📚 Mizo AI Travel Assistant API

### Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "01144218416",
  "password": "password123",
  "confirmPassword": "password123",
  "passport": "A123456"
}

Response:
{
  "status": true,
  "message": "تم التسجيل بنجاح ✅",
  "data": {
    "userId": "user_id",
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { ... }
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}

Response:
{
  "status": true,
  "message": "تم تسجيل الدخول بنجاح ✅",
  "data": {
    "userId": "user_id",
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { ... }
  }
}
```

## 💬 Chat Endpoints

### Send Message
```http
POST /chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "ما هو رقم هاتفي المسجل؟",
  "language": "ar",
  "type": "text"
}

Response:
{
  "status": true,
  "message": "تم إرسال الرسالة بنجاح ✅",
  "data": {
    "userMessage": "ما هو رقم هاتفي المسجل؟",
    "aiResponse": "رقم هاتفك المسجل عندنا هو 01144218416 ✅",
    "chatId": "chat_id"
  }
}
```

### Get Chat History
```http
GET /chat/history?limit=50
Authorization: Bearer <token>

Response:
{
  "status": true,
  "message": "تم جلب سجل المحادثات بنجاح ✅",
  "data": { ... }
}
```

## 👤 User Endpoints

### Get Profile
```http
GET /user/profile
Authorization: Bearer <token>

Response:
{
  "status": true,
  "data": {
    "fullName": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01144218416",
    "passport": "A123456",
    "role": "user",
    "status": "active"
  }
}
```

### Update Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "أحمد محمد علي",
  "phone": "01144218417",
  "passport": "A123457"
}

Response:
{
  "status": true,
  "message": "تم تحديث البيانات بنجاح ✅"
}
```

## 🛠️ Admin Endpoints

### Create Client
```http
POST /admin/clients
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "fullName": "معتز محمد",
  "email": "moataz@example.com",
  "phone": "01144218416",
  "password": "password123",
  "passport": "M123456"
}

Response:
{
  "status": true,
  "message": "تم إضافة العميل بنجاح ✅",
  "data": {
    "userId": "user_id",
    "fullName": "معتز محمد",
    "email": "moataz@example.com"
  }
}
```

### Create Trip
```http
POST /admin/trips
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "country": "السعودية",
  "hotel": "فندق الرياض الفاخر",
  "airline": "الخطوط السعودية",
  "date": "2024-06-15",
  "price": 5000,
  "description": "رحلة 5 نجوم إلى الرياض",
  "availableSeats": 20
}

Response:
{
  "status": true,
  "message": "تم إنشاء الرحلة بنجاح ✅",
  "data": { ... }
}
```

### Get Dashboard Analytics
```http
GET /admin/analytics/dashboard
Authorization: Bearer <admin_token>

Response:
{
  "status": true,
  "data": {
    "totalUsers": 150,
    "totalTrips": 25,
    "totalBookings": 340,
    "totalRevenue": 1500000
  }
}
```

## 🔑 Headers Required

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## ❌ Error Responses

```json
{
  "status": false,
  "code": 400,
  "message": "البيانات المدخلة غير صحيحة",
  "errors": ["field error"]
}
```

## 🚀 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

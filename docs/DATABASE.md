# Database Schema

## Firebase Realtime Database Structure

### Collections Overview

```
ai-mizo/
├── users/
├── chats/
├── trips/
├── bookings/
├── payments/
├── admins/
└── analytics/
```

## 📊 Collections Details

### Users Collection

```json
{
  "userId": {
    "fullName": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01144218416",
    "passport": "A123456",
    "passwordHash": "$2a$10$...",
    "role": "user",
    "status": "active",
    "createdAt": "2024-06-13T10:00:00Z",
    "updatedAt": "2024-06-13T10:00:00Z"
  }
}
```

### Chats Collection

```json
{
  "userId": {
    "chatId": {
      "role": "user",
      "content": "ما هو رقم هاتفي؟",
      "language": "ar",
      "type": "text",
      "timestamp": 1686660000000
    }
  }
}
```

### Trips Collection

```json
{
  "tripId": {
    "country": "السعودية",
    "hotel": "فندق الرياض",
    "airline": "الخطوط السعودية",
    "date": "2024-06-15",
    "price": 5000,
    "description": "رحلة 5 نجوم",
    "availableSeats": 20,
    "status": "active",
    "createdAt": "2024-06-13T10:00:00Z",
    "createdBy": "adminId"
  }
}
```

### Bookings Collection

```json
{
  "bookingId": {
    "userId": "user123",
    "tripId": "trip123",
    "numberOfPassengers": 2,
    "specialRequests": "غرف مع إطلالة",
    "status": "pending",
    "createdAt": "2024-06-13T10:00:00Z",
    "updatedAt": "2024-06-13T10:00:00Z"
  }
}
```

### Payments Collection

```json
{
  "paymentId": {
    "userId": "user123",
    "bookingId": "booking123",
    "amount": 10000,
    "method": "credit_card",
    "transactionId": "txn123456",
    "status": "completed",
    "createdAt": "2024-06-13T10:00:00Z"
  }
}
```

## 🔐 Firebase Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['fullName', 'email', 'phone'])"
      }
    },
    "chats": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "admin": {
      ".read": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

## 📈 Indexing

### Recommended Indexes

1. **Users by email**
   - Path: `users`
   - Child: `email`

2. **Bookings by userId**
   - Path: `bookings`
   - Child: `userId`

3. **Payments by userId**
   - Path: `payments`
   - Child: `userId`

4. **Chats by timestamp**
   - Path: `chats/{userId}`
   - Child: `timestamp`

## 🔄 Data Relationships

```
User (1) ──── (M) Bookings
User (1) ──── (M) Chats
Trip (1) ──── (M) Bookings
Booking (1) ──── (M) Payments
```

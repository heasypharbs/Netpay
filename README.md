# Netpay Payment API

Netpay is a **Node.js & Express**-based payment service API that allows users to:

- Register and authenticate accounts
- Process payments securely
- Manage transactions
- Handle webhook events from payment providers

## 🚀 System Requirements

Ensure your system meets the following requirements:

- **Node.js 18+**
- **Express.js**
- **MongoDB** (local or cloud database like MongoDB Atlas)
- **Postman or cURL** (for API testing)

---

## 📥 Installation Guide

Follow these steps to set up the project:

1️⃣ **Clone the repository**

```sh
  git clone https://github.com/your-repo-name.git
  cd your-repo-name
```

2️⃣ **Install dependencies**

```sh
  npm install
```

3️⃣ **Set up environment variables**

- Create a `.env` file at the project root:

```sh
  cp .env.example .env
```

- Update the following fields:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/netpay
JWT_SECRET=your-secret-key
PAYMENT_PROVIDER_API_KEY=your-provider-key
```

4️⃣ **Start the server**

```sh
  npm start
```

---

## 📡 API Endpoints

### 1️⃣ **User Registration**

**Endpoint:** `POST /api/auth/register`

**Payload:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "your-jwt-token"
}
```

---

### 2️⃣ **User Login**

**Endpoint:** `POST /api/auth/login`

**Payload:**

```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "your-jwt-token"
}
```

---

### 3️⃣ **Process Payment**

**Endpoint:** `POST /api/payments/process`

**Headers:**

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

**Payload:**

```json
{
  "amount": 5000,
  "currency": "NGN",
  "paymentMethod": "card",
  "customer": {
    "email": "johndoe@example.com",
    "phone": "08123456789"
  }
}
```

**Response:**

```json
{
  "message": "Payment initiated successfully",
  "transactionId": "txn_123456"
}
```

---

### 4️⃣ **Get Transaction Status**

**Endpoint:** `GET /api/payments/status/:transactionId`

**Response:**

```json
{
  "transactionId": "txn_123456",
  "status": "successful",
  "amount": 5000,
  "currency": "NGN",
  "timestamp": "2024-03-08T12:00:00Z"
}
```

---

### 5️⃣ **Webhook for Payment Notifications**

**Endpoint:** `POST /api/webhooks/payment`

**Payload:**

```json
{
  "event": "payment_success",
  "data": {
    "transactionId": "txn_123456",
    "status": "successful",
    "amount": 5000
  }
}
```

**Response:**

```json
{
  "message": "Webhook processed successfully"
}
```

---

## 🛠 Debugging & Logs

If you encounter issues, check logs with:

```sh
  npm run logs
```

Or manually inspect MongoDB logs:

```sh
  mongod --verbose
```

---

## 🚀 Deployment Guide

1️⃣ **Build the application**

```sh
  npm run build
```

2️⃣ **Run on production server**

```sh
  npm start
```

3️⃣ **Deploy on a cloud server (e.g., AWS, DigitalOcean, Heroku, Vercel, etc.)**

For Docker deployment:

```sh
  docker build -t netpay-api .
  docker run -d -p 5000:5000 netpay-api
```

---

## 🔗 Repository Link

[GitHub Repo](https://github.com/heasypharbs/netpay-api.git)

## 🔗 API Documentation

[Postman Collection](https://documenter.getpostman.com/view/25992660/2sAYk7RPbd)

---

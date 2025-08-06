# 📡 Collab Blog API

This is the backend API for the **Collab Blog** platform, built with **Node.js**, **Express**, **MongoDB**, and **Socket.io**. It powers a multi-author blogging system with real-time commenting, role-based permissions, and secure authentication.

## 🚀 Features

- **User Authentication** with JWT + Refresh Token
- **Role Management**: Admin, Editor, Writer, Reader
- **Article CRUD** with dynamic permissions
- **Real-Time Comments** using Socket.io
- **Security Best Practices**: bcrypt, CORS, rate limiting
- **Scalable Architecture** ready for microservices

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Real-Time**: Socket.io
- **Auth**: JWT, bcrypt
- **Dev Tools**: Nodemon, Postman

## 🔐 Authentication Endpoints

Implemented and documented via Postman:

- **POST `/api/auth/register`**Registers a new user with `username`, `email`, and `password`.
- **POST `/api/auth/login`**
  Authenticates a user and returns a JWT access token and refresh token.

📄 View full API documentation on [Postman Auth Collection](https://www.postman.com/aziz-tarous-dev/collab-blog-api-docs/collection/93rg6eq/auth?action=share&creator=13760370)

## 📝 Article Endpoints

Manage blog articles with full CRUD operations and role-based access:

- **POST `/api/articles`**  
  Create a new article (requires Writer or higher role).

- **GET `/api/articles`**  
  Fetch all published articles.

- **GET `/api/articles/:id`**  
  Retrieve a specific article by ID.

- **PUT `/api/articles/:id`**  
  Update an article (Editor or Admin only).

- **DELETE `/api/articles/:id`**  
  Delete an article (Admin only).

📄 View full Article API documentation on [Postman Article Collection](https://www.postman.com/aziz-tarous-dev/collab-blog-api-docs/collection/oypsd80/article?action=share&source=copy-link&creator=13760370)

## 🛠️ Installation

```bash
git clone https://github.com/your-username/collab-blog-api.git
cd collab-blog-api
npm install
```

Create a `.env` file based on `.env.example` and set your environment variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://bbb:aaa@collab-blog.lszsp9b.mongodb.net/collabblogs
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
TOKEN_EXPIRE=15m
REFRESH_EXPIRE=7d
```

## ▶️ Running the Server

```bash
npm run dev
```

## 📁 Project Structure

```
collab-blog-api/
├── src
| ├── controllers/
| ├── models/
| ├── routes/
| ├── middleware/
| ├── uploads/
| └── utils/
├── app.js
├── server.js
├── .env
└── .gitignore
```

## 📡 Real-Time Comments

- Users can comment on articles in real time.
- Replies are nested.
- Article authors receive live notifications via WebSockets.

## 🧪 Testing

Use Postman or your preferred tool to test endpoints.
collection: [Postman](https://www.postman.com/aziz-tarous-dev/collab-blog-api-docs)

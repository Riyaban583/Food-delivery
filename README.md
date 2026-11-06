<<<<<<< HEAD
# Food-delivery
Food Delivery Web Application A full-stack Food Delivery Web Application built using MERN Stack (MongoDB, Express, React, Node.js) with Stripe Payment Gateway integration. This project allows users to browse food items, add them to cart, place orders, and make secure online payments.
=======
🍔 Food Delivery Web Application
A full-stack Food Delivery Web Application built using MERN Stack (MongoDB, Express, React, Node.js) with Stripe Payment Gateway integration.
This project allows users to browse food items, add them to cart, place orders, and make secure online payments.

🚀 Features
👤 User Features
User Registration & Login (JWT Authentication)
Browse food items with images
Add / Remove items from cart
View cart summary
Place orders with delivery details
Secure payment using Stripe Checkout

🛠️ Admin / Backend Features
RESTful APIs
MongoDB database for users, foods, carts & orders
JWT-based protected routes
Stripe payment session handling
Image upload & static serving

🧑‍💻 Tech Stack
Frontend
React.js
React Router
Context API (Global State Management)
Axios
CSS
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Stripe API
Multer (for image uploads)

📂 Project Structure
food-del/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── .env
│
└── README.md

💳 Stripe Payment Flow

User clicks Proceed to Payment

Backend creates Stripe Checkout Session

User is redirected to Stripe Payment Page

On success/failure → redirected back to frontend

📌 Future Improvements

Admin Dashboard
Order Tracking
Payment Verification Webhooks
Email Notifications
Mobile Responsive UI
>>>>>>> 782b43d (Initial clean commit)

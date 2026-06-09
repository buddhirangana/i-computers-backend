# iComputers Backend API

A secure, scalable RESTful API built with Node.js, Express, and MongoDB for the **iComputers** e-commerce platform.

---

## 🚀 Key Features

- **User Authentication & Management**: JWT-based session security, profile management, and password update logic.
- **Social Login**: OAuth2-ready login integration for Google validation.
- **OTP Verification**: Password reset workflow via OTP code emails powered by `nodemailer`.
- **Admin Control Panel**: Block/unblock users, promote/demote administrators, approve reviews, and update order statuses.
- **Product Catalog**: Paginated search, detail view, creation, updating, and availability control.
- **Order Management**: Automatic incremental order ID generation, validation of stock availability, and user order logs.
- **Reviews & Ratings**: Product feedback loop with admin moderation controls.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime Environment**: Node.js (ES Modules syntax: `"type": "module"`)
- **Framework**: [Express.js](https://expressjs.com/) (v5.x.x)
- **Database Engine**: MongoDB Atlas via [Mongoose](https://mongoosejs.com/)
- **Security**: [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing & [JSON Web Token (JWT)](https://jwt.io/) for access tokens
- **Email Service**: [Nodemailer](https://nodemailer.com/) for SMTP OTP delivery
- **Dev-Server**: Nodemon for hot-reload in development

---

## 📁 Project Structure

```bash
i-computers-backend/
├── controllers/            # Request handlers (business logic)
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── userController.js
├── middlewares/            # Custom Express middleware
│   └── authentication.js   # JWT verification middleware
├── models/                 # Mongoose schemas & models
│   ├── order.js
│   ├── otp.js
│   ├── product.js
│   ├── review.js
│   └── user.js
├── routers/                # Express router endpoints
│   ├── orderRouter.js
│   ├── productRouter.js
│   ├── reviewRouter.js
│   └── userRouter.js
├── .env                    # Local environment config (gitignored)
├── index.js                # App entry point & MongoDB connection
└── package.json            # Node dependencies and scripts
```

---

## ⚙️ Getting Started

### Prerequisites
1. **Node.js** (v16+) installed.
2. **MongoDB Atlas URI** (or local running instance of MongoDB).
3. **Gmail Credentials** with an App Password enabled (if you want to test OTP emails).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd i-computers-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   MONGO_URI="your-mongodb-connection-string"
   JWT_SECRET="your-jwt-signing-secret"
   GMAIL="your-gmail-address@gmail.com"
   GMAIL_APP_PASSWORD="your-gmail-app-specific-password"
   ```

4. **Run the Development Server:**
   ```bash
   npm start
   ```
   The API will start running on [http://localhost:3000](http://localhost:3000).

---

## 🔒 Authentication Middleware

Most write operations and profile accesses require a valid JSON Web Token. The authorization token should be passed in the headers as:
```http
Authorization: Bearer <your_jwt_token>
```

The server decodes the token and attaches user information to `req.user`.
- If the token is invalid: returns `401 Unauthorized`
- If no header is provided: request proceeds anonymously (`req.user` will be undefined)

---

## 📡 API Reference

### 🧑‍💼 User Routes (`/api/users`)

| Method | Endpoint | Auth Required | Description |
|:---|:---|:---:|:---|
| **POST** | `/api/users/` | None | Registers a new user. |
| **POST** | `/api/users/login` | None | Log in a user. Returns JWT and `isAdmin`. |
| **GET** | `/api/users/me` | User | Get current user's profile information. |
| **PUT** | `/api/users/` | User | Update profile (first name, last name, image). |
| **PUT** | `/api/users/password` | User | Change account password. |
| **POST** | `/api/users/google-login` | None | Authenticate via Google OAuth Access Token. |
| **POST** | `/api/users/send-otp` | None | Generate and email an OTP code for password reset. |
| **POST** | `/api/users/verify-otp` | None | Verify OTP code and reset account password. |
| **GET** | `/api/users` | **Admin** | Retrieves all registered users (passwords omitted). |
| **PUT** | `/api/users/:email/block` | **Admin** | Toggle blocking state of a user account. |
| **PUT** | `/api/users/:email/role` | **Admin** | Toggle admin privileges for a user. |

---

### 📦 Product Routes (`/api/products`)

| Method | Endpoint | Auth Required | Description |
|:---|:---|:---:|:---|
| **GET** | `/api/products` | None / Admin | Get all products. (Admins see all; regular users only see available products). |
| **POST** | `/api/products` | Admin / None* | Create a new product. (*Admin checks can be enforced). |
| **GET** | `/api/products/:productId` | None / Admin | Get product details. (Unavailable products restricted to admins). |
| **PUT** | `/api/products/:productId` | **Admin** | Update product details by its unique `productId`. |
| **DELETE** | `/api/products/:productId` | **Admin** | Delete a product. |
| **GET** | `/api/products/search/:query` | None | Search products by name, description, or altNames. |

---

### 🛒 Order Routes (`/api/orders`)

| Method | Endpoint | Auth Required | Description |
|:---|:---|:---:|:---|
| **POST** | `/api/orders` | User | Place a new order. Automatically assigns sequential `ORD` IDs. |
| **GET** | `/api/orders/:pageSize/:pageNumber` | User / Admin | Get paginated orders. (Admins get all; users get their own history). |
| **PUT** | `/api/orders/:orderId` | **Admin** | Update status (e.g., Pending, Shipped) and admin notes. |

---

### 💬 Review Routes (`/api/reviews`)

| Method | Endpoint | Auth Required | Description |
|:---|:---|:---:|:---|
| **GET** | `/api/reviews/product/:productId` | None | Get all approved reviews for a specific product. |
| **POST** | `/api/reviews` | User | Post a rating (1-5 stars) and comment for a product. |
| **DELETE** | `/api/reviews/:id` | User / Admin | Delete a review. Users can delete their own; admins any. |
| **GET** | `/api/reviews` | **Admin** | Get a list of all product reviews. |
| **PUT** | `/api/reviews/:id/approve` | **Admin** | Toggle approval/moderation status of a review. |

---

## 🗄️ Database Schemas (Models)

### `User`
- `email` (String, required, unique)
- `firstName` / `lastName` (String, required)
- `password` (String, required)
- `isAdmin` (Boolean, default: `false`)
- `isBlocked` (Boolean, default: `false`)
- `isEmailVerified` (Boolean, default: `false`)
- `image` (String, default: `"/images/default-profile.png"`)

### `Product`
- `productId` (String, unique, required)
- `name` (String, required)
- `altNames` (Array of Strings, default: `[]`)
- `price` / `labelledPrice` (Number, required)
- `description` (String)
- `images` (Array of Strings, default placeholder list)
- `brand` / `model` (String)
- `category` (String, required)
- `isAvailable` (Boolean, default: `true`)
- `stock` (Number, default: `0`)

### `Order`
- `orderId` (String, unique, required, incremental, e.g., `ORD00000001`)
- `email` / `firstName` / `lastName` (String, required)
- `addressLineOne` (String, required), `adressLineTwo` (String)
- `city` / `state` / `postalCode` / `phone` (String, required)
- `status` (String, default: `"Pending"`)
- `notes` (String)
- `total` (Number, required)
- `date` (Date, default: `Date.now`)
- `items` (Array of subdocuments containing copies of product name, ID, price, image, and the ordered quantity)

### `Review`
- `productId` (String, indexed, required)
- `email` / `firstName` / `lastName` (String, required)
- `image` (String)
- `rating` (Number, 1 to 5, required)
- `comment` (String, required)
- `isApproved` (Boolean, default: `true`)
- `date` (Date, default: `Date.now`)

### `OTP`
- `email` (String, unique, required)
- `otp` (String, required)
- `createdTime` (Date, default: `Date.now`)

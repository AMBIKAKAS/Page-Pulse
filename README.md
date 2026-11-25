# Page Pulse 🚀
### AI-Powered Website SEO Audit & Performance Analysis Platform

Page Pulse is a full-stack web application that helps users analyze website SEO health through automated audits. It provides actionable insights into website structure, metadata, and SEO-related factors through a clean, interactive dashboard.

## 🌐 Live Demo

- **Frontend:** https://page-pulse-delta-eight.vercel.app/
- **Backend API:** https://page-pulse-backend-t6np.onrender.com/

## ✨ Features

- **User Authentication:** Secure user registration and login using JWT.
- **Website SEO Audits:** Analyze websites by entering their URLs.
- **SEO Score & Grades:** View an overall SEO score and grade.
- **Detailed Audit Results:** Explore SEO metrics and improvement opportunities.
- **Audit History:** Access previously performed audits.
- **User-Specific Data:** Each user can access their own audit records.
- **Responsive Dashboard:** Clean interface for desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Cheerio
- Axios

**Tools & Deployment**
- Git & GitHub
- Postman
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## 🏗️ Architecture

```text
Page Pulse
│
├── client/
│   ├── React.js + Vite
│   ├── Components
│   ├── Dashboard
│   └── API Integration
│
└── server/
    ├── Express.js API
    ├── Authentication
    ├── SEO Audit Services
    ├── MongoDB Models
    └── Protected Routes
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AMBIKAKAS/Page-Pulse.git
cd Page-Pulse
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

## 🔐 Security

- JWT-based authentication.
- Protected audit API routes.
- User-specific audit data access.
- Environment variables for sensitive configuration.

## 🚀 Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

## 👩‍💻 Author

**Ambika Kashyap**

- GitHub: [AMBIKAKAS](https://github.com/AMBIKAKAS)
- LinkedIn: [Ambika Kashyap](https://www.linkedin.com/in/ambika70026/)

---

*Built to make website SEO analysis more accessible through a modern full-stack experience.*

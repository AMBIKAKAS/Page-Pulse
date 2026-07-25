# 🚀 Page Pulse

## Modern Website Auditing Platform

Page Pulse is a full-stack website auditing application that analyzes websites and provides important technical insights including performance details, HTML structure, metadata, and accessibility-related information.

The application allows users to enter any valid URL and generates a detailed audit report through a clean and interactive dashboard.

---
Live Demostration: https://page-pulse-delta-eight.vercel.app/
---

# ✨ Features

- Website URL Analysis
- HTTP Status Detection
- Response Time Calculation
- Page Title Extraction
- Meta Description Analysis
- H1 Tag Count
- Missing Image ALT Detection
- Word Count Analysis
- URL Validation
- Error Handling
- Responsive Dashboard UI
- Backend API Testing

---

# 📸 OVERVIEW
<img src="screenshots/Screenshot%202026-07-25%20at%202.26.20%E2%80%AFPM.png"  width="800"/>

<img src="screenshots/Screenshot%202026-07-25%20at%202.26.29%E2%80%AFPM.png"  width="800"/>

<img src="screenshots/Screenshot%202026-07-25%20at%202.26.37%E2%80%AFPM.png" width="800"/>

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios

## Backend

- Node.js
- Express.js
- Axios
- Cheerio
- Validator
- CORS

## Testing

- Vitest
- Supertest

---

# 📂 Project Structure

```
Page Pulse

├── client
│   ├── src
│   ├── components
│   └── package.json
│
├── server
│   ├── routes
│   ├── tests
│   ├── index.js
│   └── package.json
│
├── README.md

```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone YOUR_REPOSITORY_URL

cd page-pulse
```

---

# Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔌 API Documentation

## Audit Website

### POST

```
/api/audit
```

### Request Body

```json
{
  "url": "https://example.com"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "status": 200,
    "title": "Example Domain",
    "responseTime": "500 ms",
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "wordCount": 152
  }
}
```

---

# 🧪 Testing

Backend validation tests are implemented using Vitest.

Test cases:

- Valid URL
- Invalid URL
- Empty URL

Run tests:

```bash
cd server

npm test
```

Expected:

```
✓ Valid URL
✓ Invalid URL
✓ Empty URL

3 tests passed
```

---

# 🏗️ Design Decisions

### Separate Frontend and Backend

Frontend and backend are separated to improve scalability, maintainability, and deployment flexibility.

### Cheerio HTML Parser

Cheerio was used because it provides fast HTML parsing without requiring a browser environment.

### Error Handling

Implemented:

- URL validation
- Timeout handling
- API error responses
- Invalid input handling

to provide a reliable user experience.

---

# 🚀 Deployment

## Frontend

Deployed using:

**Vercel**

## Backend

Deployed using:

**Render**

---

# 🤖 AI Usage

AI tools were used to accelerate development, improve UI ideas, generate initial boilerplate, and assist with debugging.

All AI-generated suggestions were reviewed, customized, tested, and modified manually before being included in the final implementation.



---

# 👩‍💻 Author

**Ambika Kashyap**

GitHub:
https://github.com/AMBIKAS

LinkedIn:
https://linkedin.com/in/ambika70026

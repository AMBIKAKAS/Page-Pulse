require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const auditRoutes = require("./routes/auditRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Page Pulse API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected audit routes
app.use("/api", auditRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Page Pulse server running on port ${PORT}`);
  });
};

startServer();
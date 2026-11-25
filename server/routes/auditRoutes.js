const express = require("express");
const router = express.Router();

const {
  auditWebsite,
  getAuditHistory,
  getAuditById,
  deleteAudit,
} = require("../controllers/auditController");

const { protect } = require("../middleware/authMiddleware");

// All audit routes require authentication
router.use(protect);

router.post("/audit", auditWebsite);
router.get("/history", getAuditHistory);
router.get("/history/:id", getAuditById);
router.delete("/history/:id", deleteAudit);

module.exports = router;
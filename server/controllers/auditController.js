
const mongoose = require("mongoose");
const validator = require("validator");
const Audit = require("../models/Audit");
const { auditWebsiteService } = require("../services/auditService");

// Create a new website audit
const auditWebsite = async (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "Please provide a website URL.",
      });
    }

    const cleanUrl = url.trim();

    if (
      cleanUrl.length > 2048 ||
      !validator.isURL(cleanUrl, {
        require_protocol: true,
        protocols: ["http", "https"],
        require_valid_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid HTTP or HTTPS URL.",
      });
    }

    const result = await auditWebsiteService(cleanUrl);

    const audit = await Audit.create({
      user: req.user.id,
      url: result.url,
      seoScore: result.seoScore,
      seoGrade: result.seoGrade,
      result,
    });

    return res.status(200).json({
      success: true,
      data: result,
      auditId: audit._id,
      message: "Audit completed and saved successfully.",
    });
  } catch (error) {
    console.error("Audit Error:", error);

    const status =
      error.message?.includes("timed out") ? 504 :
      error.message?.includes("HTML content") ? 422 :
      500;

    return res.status(status).json({
      success: false,
      error: error.message || "Website audit failed.",
    });
  }
};

// Get logged-in user's audit history
const getAuditHistory = async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user.id })
      .select("-result")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: audits.length,
      data: audits,
    });
  } catch (error) {
    console.error("History Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch audit history.",
    });
  }
};

// Get one audit belonging to logged-in user
const getAuditById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid audit ID.",
      });
    }

    const audit = await Audit.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: "Audit not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: audit,
    });
  } catch (error) {
    console.error("Get Audit Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch audit.",
    });
  }
};

// Delete one audit belonging to logged-in user
const deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid audit ID.",
      });
    }

    const audit = await Audit.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: "Audit not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Audit Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to delete audit.",
    });
  }
};

module.exports = {
  auditWebsite,
  getAuditHistory,
  getAuditById,
  deleteAudit,
};

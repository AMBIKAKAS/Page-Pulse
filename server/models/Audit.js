const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      // Optional temporarily for compatibility with old records
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    seoScore: {
      type: Number,
      required: true,
    },

    seoGrade: {
      type: String,
      required: true,
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Audit", auditSchema);
const validator = require("validator");
const { auditWebsiteService } = require("../services/auditService");

const auditWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    if (
      !validator.isURL(url, {
        require_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid URL",
      });
    }

    const result = await auditWebsiteService(url);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { auditWebsite };
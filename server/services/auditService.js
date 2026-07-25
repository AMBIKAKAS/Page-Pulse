const axios = require("axios");
const { parseHTML } = require("../utils/parser");

const auditWebsiteService = async (url) => {
  const start = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true,
    });

    const end = Date.now();

    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
      throw new Error("Response is not HTML");
    }

    const parsed = parseHTML(response.data);

    return {
      url,
      status: response.status,
      responseTime: `${end - start} ms`,
      ...parsed,
    };
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out");
    }

    throw err;
  }
};

module.exports = {
  auditWebsiteService,
};
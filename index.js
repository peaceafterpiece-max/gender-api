const express = require("express");
const axios = require("axios");

const app = express();

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/classify", async (req, res) => {
  try {
    const name = req.query.name;

    // FIX 1: strict validation
    if (name === undefined || name === null) {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name parameter",
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "name is not a string",
      });
    }

    const cleanName = name.trim();

    if (cleanName === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name parameter",
      });
    }

    // FIX 2: correct API call
    const response = await axios.get(
      `https://api.genderize.io?name=${cleanName}`
    );

    const data = response.data;

    // FIX 3: correct edge case handling
    if (!data.gender || data.count === 0) {
      return res.status(404).json({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }

    const result = {
      name: cleanName,
      gender: data.gender,
      probability: data.probability,
      sample_size: data.count,
      is_confident:
        data.probability >= 0.7 && data.count >= 100,
      processed_at: new Date().toISOString(),
    };

    return res.status(200).json({
      status: "success",
      data: result,
    });

  } catch (error) {
    return res.status(502).json({
      status: "error",
      message: "Upstream or server failure",
    });
  }
});

module.exports = app;
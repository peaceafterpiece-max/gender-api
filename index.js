const express = require("express");
const axios = require("axios");

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// API endpoint
app.get("/api/classify", async (req, res) => {
  try {
    const name = req.query.name;

    // Error: missing name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name parameter",
      });
    }

    // Call Genderize API
    const response = await axios.get(
      `https://api.genderize.io/?name=${name}`
    );

    const data = response.data;

    // Edge case
    if (!data.gender || data.count === 0) {
      return res.status(422).json({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }

    // Process result
    const result = {
      name: name,
      gender: data.gender,
      probability: data.probability,
      sample_size: data.count,
      is_confident:
        data.probability >= 0.7 && data.count >= 100,
      processed_at: new Date().toISOString(),
    };

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
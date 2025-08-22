const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

// Connect to MongoDB and start server
mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit process with failure
  });
let server;


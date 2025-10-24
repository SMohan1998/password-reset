const express = require("express");
const cors = require("cors");
const allowedOrigins = [process.env.CLIENT_URL || "https://pwd-reset.netlify.app"];
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const resetroutes = require("./routes/resetroutes");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(bodyParser.json());
// Serve frontend static files at /frontend
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.use("/api", resetroutes);

//un-matched routes catch
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
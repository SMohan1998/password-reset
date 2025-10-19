const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

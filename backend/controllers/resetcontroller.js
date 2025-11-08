const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

// Request reset link
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      //const token = uuidv4();
      return res.status(404).json({ msg: "User not found" });
    }

    const token = uuidv4();
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    //console.log(`📩 Simulated email: http://localhost:5500/frontend/reset.html?token=${token}`);
    //res.json({ msg: "Reset link generated. Check console log for link." });
    // Build reset link from CLIENT_URL (set this in .env)
    // ...existing code...
    // Build reset link from CLIENT_URL (set this in .env)
    //const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
    const clientBase = process.env.CLIENT_URL || "https://pwd-reset.netlify.app";
    // APP ROUTE (query param), not a source file path
    const resetLink = `${clientBase}/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click this link to reset your password: ${resetLink} 
      If you didn't request this, please ignore this email.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ msg: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ msg: "Reset link sent to email." });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

    //console.log(`📩 Simulated email: ${resetLink}`);
   // res.json({ msg: "Reset link generated. Check console log for link." });
// ...existing code...
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  //debug line
  console.log("Resetting password with token:", token);
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

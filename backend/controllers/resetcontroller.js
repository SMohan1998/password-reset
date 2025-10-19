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
    const clientBase = process.env.CLIENT_URL || "http://127.0.0.1:5500/password-reset/frontend";
    const resetLink = `${clientBase}/reset.html?token=${token}`;
    console.log(`📩 Simulated email: ${resetLink}`);
    res.json({ msg: "Reset link generated. Check console log for link." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
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

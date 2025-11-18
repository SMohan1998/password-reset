const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const axios = require("axios");

//helper function to send Brevo email
async function sendBrevoEmail(recipient, subject, textContent, htmlContent) {
  const apiKey = process.env.BREVO_API_KEY;
  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: "Brevo", email: process.env.EMAIL_FROM },
    to: [{ email: recipient }],
    subject: subject,
    textContent: textContent,
    htmlContent: htmlContent
  }, {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });
}

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

    const clientBase = process.env.CLIENT_URL || "https://pwd-reset.netlify.app";
    // APP ROUTE (query param), not a source file path
    const resetLink = `${clientBase}/reset-password/${token}`;
    const emailSubject = "Password Reset Request";
    const emailText = `You requested a password reset. Click this link to reset your password: ${resetLink}\nIf you didn't request this, please ignore this email.`;
    const emailHtml = `<p>You requested a password reset. Click this link to reset your password:</p><a href="${resetLink}">this link</a><br>
    <p>If you didn't request this, please ignore this email.</p>`;

    try{
      //send password reset email via Brevo
      await sendBrevoEmail(user.email, emailSubject, emailText, emailHtml); 
        return res.json({ msg: "Reset link sent to email." });
    }
    catch(verifyErr){
      console.error("Error Sending Email", verifyErr);
       console.log("Fallback reset link:", resetLink);
      return res.status(202).json({
        msg: "Reset link generated but email delivery failed. Check server console for the link.",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

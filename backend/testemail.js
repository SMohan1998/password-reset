const nodemailer = require("nodemailer");

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cb300pro@gmail.com", // replace with your email address or env var
      pass: "",    // replace with your app password or env var
    },
  });

  let info = await transporter.sendMail({
    from: '"Test" <cb300pro@gmail.com>',
    to: "dmvssk17@gmail.com",  // can be your own email for testing
    subject: "Test Email",
    text: "This is a test email from Nodemailer",
  });

  console.log("Message sent: %s", info.messageId);
}

sendTestEmail().catch(console.error);
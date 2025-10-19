const API_BASE_URL = "http://localhost:5000/api";

// Handle "Send Reset Link"
if (document.getElementById("resetBtn")) {
  document.getElementById("resetBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message");

    if (!email) {
      message.textContent = "Please enter your email.";
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      message.textContent = data.message || data.msg || "Check your email (console).";
    } catch (err) {
      message.textContent = "Error sending reset link.";
    }
  });
}

// Handle "Update Password"
if (document.getElementById("updateBtn")) {
  document.getElementById("updateBtn").addEventListener("click", async () => {
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const token = new URLSearchParams(window.location.search).get("token");

    if (!password) {
      message.textContent = "Please enter a new password.";
      return;
    }
    if (!token) {
      message.textContent = "Missing reset token in URL.";
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = "success.html";
      } else {
        message.textContent = data.message || data.msg || "Reset failed.";
      }
    } catch (err) {
      message.textContent = "Error resetting password.";
    }
  });
}

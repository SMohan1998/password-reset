import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const API = import.meta.env.VITE_API_BASE || "https://password-reset-dixq.onrender.com/api"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match!");
      return;
    }
    if (!token) {
      setMessage("Missing token in URL");
      return;
    }

    try {
      const response = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/success"), 1500);
      } else {
        setMessage(data.msg || data.message || "Invalid or expired token");
      }
    } catch  {
      setMessage("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="form-group mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success w-100">Reset Password</button>
      </form>
      {message && <p className="text-center mt-3 text-info">{message}</p>}
    </div>
  );
}

export default ResetPassword;

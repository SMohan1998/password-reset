import React, { useState } from "react";

function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      const response = await fetch("http://localhost:5000/api/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Reset link generated! Check backend console for the link.");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server connection failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Request Password Reset</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="form-group mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Send Reset Link</button>
      </form>
      {message && <p className="text-center mt-3 text-success">{message}</p>}
    </div>
  );
}

export default RequestReset;
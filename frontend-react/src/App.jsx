import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestReset from "./components/request-reset.jsx";
import ResetPassword from "./components/reset-password.jsx";
import Success from "./components/success.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequestReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
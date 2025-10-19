const express = require("express");
const router = express.Router();
const {requestReset, resetPassword } = require("../controllers/resetcontroller");

router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);

module.exports = router;
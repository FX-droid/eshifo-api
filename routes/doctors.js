const express = require("express");
const router = express.Router();
const { registerDoctor, getDoctors } = require("../controllers/doctorController");

router.post("/register", registerDoctor);
router.get("/", getDoctors);

module.exports = router;

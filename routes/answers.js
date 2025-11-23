const express = require("express");
const router = express.Router();
const { createAnswer, getAnswers } = require("../controllers/answerController");

router.post("/create", createAnswer);
router.get("/", getAnswers);

module.exports = router;

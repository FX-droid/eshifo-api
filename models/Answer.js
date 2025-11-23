const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
    request_id: { type: String, required: true },
    doctor_id: { type: String, required: true },
    text: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Answer", AnswerSchema);

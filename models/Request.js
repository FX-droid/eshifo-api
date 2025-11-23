const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    user_id: { type: String, required: true },   // telegram_id
    disease: { type: String, required: true },
    complaint: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | answered
    assigned_doctor_id: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", RequestSchema);

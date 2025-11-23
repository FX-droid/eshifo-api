const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    specialization: { type: String },
    telegram_id: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Doctor", DoctorSchema);

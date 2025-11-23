const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    telegram_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    phone: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

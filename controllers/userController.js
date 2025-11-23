const User = require("../models/User");

exports.registerUser = async (req, res) => {
    try {
        const { telegram_id, full_name, phone } = req.body;
        if (!telegram_id || !full_name) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const user = await User.findOneAndUpdate(
            { telegram_id },
            { full_name, phone },
            { upsert: true, new: true }
        );
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

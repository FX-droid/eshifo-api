const Doctor = require("../models/Doctor");

exports.registerDoctor = async (req, res) => {
    try {
        const { email, name, specialization, telegram_id } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const doctor = await Doctor.findOneAndUpdate(
            { email },
            { name, specialization, telegram_id },
            { upsert: true, new: true }
        );
        res.json({ success: true, doctor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDoctors = async (req, res) => {
    const doctors = await Doctor.find();
    res.json(doctors);
};

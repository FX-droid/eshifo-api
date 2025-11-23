const Answer = require("../models/Answer");
const Request = require("../models/Request");

exports.createAnswer = async (req, res) => {
    try {
        const { request_id, doctor_id, text } = req.body;
        if (!request_id || !doctor_id || !text) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const answer = await Answer.create({ request_id, doctor_id, text });

        // update request status
        await Request.findByIdAndUpdate(request_id, {
            status: "answered",
            assigned_doctor_id: doctor_id
        });

        res.json({ success: true, answer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAnswers = async (req, res) => {
    const answers = await Answer.find();
    res.json(answers);
};

const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
    try {
        const { user_id, disease, complaint } = req.body;
        if (!user_id || !disease || !complaint) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const request = await Request.create({ user_id, disease, complaint });
        res.json({ success: true, request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRequests = async (req, res) => {
    const requests = await Request.find();
    res.json(requests);
};

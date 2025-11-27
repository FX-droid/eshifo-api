const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// In-memory data
const users = [];
const doctors = [];
const requests = [];
const answers = [];

// === USERS ===
app.post("/users/register", (req, res) => {
    const { username, full_name, phone } = req.body;
    const user = { username, full_name, phone, created_at: new Date() };
    users.push(user);
    res.json({ success: true, user });
});

app.get("/users", (req, res) => res.json(users));

// === DOCTORS ===
app.post("/doctors/register", (req, res) => {
    const { username, email, name, specialization } = req.body;
    const doctor = { username, email, name, specialization, created_at: new Date() };
    doctors.push(doctor);
    res.json({ success: true, doctor });
});

// GET doctors + stats (nechta javob berganini ko‘rsatadi)
app.get("/doctors", (req, res) => {
    const doctorsWithStats = doctors.map(doc => {
        const answersCount = answers.filter(a => a.doctor_username === doc.username).length;
        return { ...doc, answersCount };
    });
    res.json(doctorsWithStats);
});

// === REQUESTS ===
app.post("/requests/create", (req, res) => {
    const { username, disease, complaint } = req.body;
    const request = { id: Date.now().toString(), username, disease, complaint, status: "pending" };
    requests.push(request);
    res.json({ success: true, request });
});

app.get("/requests", (req, res) => res.json(requests));

// === ANSWERS ===
app.post("/answers/create", (req, res) => {
    const { request_id, doctor_username, text } = req.body;
    const answer = { id: Date.now().toString(), request_id, doctor_username, text, created_at: new Date() };
    answers.push(answer);

    // update request status
    const reqIndex = requests.findIndex(r => r.id === request_id);
    if (reqIndex !== -1) requests[reqIndex].status = "answered";

    res.json({ success: true, answer });
});

app.get("/answers", (req, res) => res.json(answers));

// === RUN ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

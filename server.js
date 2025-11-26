const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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
app.post("/doctors/register", async (req, res) => {
    try {

        res.json({ message: "Doctor registered" });
    } catch (err) {
        console.error("Error in /doctors/register:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/doctors", (req, res) => res.json(doctors));

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
app.listen(3000, () => console.log("API running on port 3000"));

/* === Example data qo‘shib qo‘yish === */
users.push({ username: "@faxriyorbotirxonovgo", full_name: "Faxriyor", phone: "998901112233", created_at: new Date() });
doctors.push({ username: "@faxriyorbotirxonovgo", email: "doctor@example.com", name: "Faxriyor", specialization: "Terapevt", created_at: new Date() });
const reqId = Date.now().toString();
requests.push({ id: reqId, username: "faxriyor", disease: "Gripp", complaint: "2 kundan beri isitma va yo‘tal", status: "answered" });
answers.push({ id: Date.now().toString(), request_id: reqId, doctor_username: "@faxriyorbotirxonovgo", text: "Paracetamol iching va ko‘proq suyuqlik iching", created_at: new Date() });

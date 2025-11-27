const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
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

// === Example data qo‘shib qo‘yish ===
users.push({
    username: "@faxriyorbotirxonovgo",
    full_name: "Faxriyor Botirxonov",
    phone: "998901112233",
    created_at: new Date()
});

doctors.push({
    username: "@doctor_ali",
    email: "doctorali@example.com",
    name: "Ali Karimov",
    specialization: "Terapevt",
    created_at: new Date()
});


const reqId1 = Date.now().toString();
requests.push({
    id: reqId1,
    username: "patient_1",
    disease: "Gripp",
    complaint: "2 kundan beri isitma va yo‘tal",
    status: "answered"
});

answers.push({
    id: Date.now().toString(),
    request_id: reqId1,
    doctor_username: "@doctor_ali",
    text: "Paracetamol iching va ko‘proq suyuqlik iching",
    created_at: new Date()
});

const reqId2 = (Date.now() + 1).toString();
requests.push({
    id: reqId2,
    username: "patient_2",
    disease: "Bosh og‘rig‘i",
    complaint: "Ko‘p ishlaganimdan keyin boshim qattiq og‘riyapti",
    status: "pending"
});

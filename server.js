const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
const admins = []; // 🔑 adminlar

// === ADMIN REGISTER ===
app.post("/admins/register", async (req, res) => {
    const { username, code } = req.body;
    const hashedCode = await bcrypt.hash(code, 10);
    const admin = { username, code: hashedCode, created_at: new Date() };
    admins.push(admin);
    res.json({ success: true, admin });
});



// === ADMINS LIST ===
app.get("/admins", (req, res) => {
    const adminsList = admins.map(a => ({
        username: a.username,
        created_at: a.created_at
    }));
    res.json(adminsList);
});


// === ADMIN LOGIN ===
app.post("/admins/login", async (req, res) => {
    const { username, code } = req.body;
    const admin = admins.find(a => a.username === username);
    if (!admin) return res.status(401).json({ error: "Admin not found" });

    const match = await bcrypt.compare(code, admin.code);
    if (!match) return res.status(401).json({ error: "Invalid code" });

    const token = jwt.sign({ username: admin.username, role: "admin" }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ success: true, token });
});

// === Example admin qo‘shib qo‘yish ===
(async () => {
    const hashedCode = await bcrypt.hash("admin123", 10);
    admins.push({
        username: "superadmin",
        code: hashedCode,
        created_at: new Date()
    });
})();

// === USERS ===
app.post("/users/register", (req, res) => {
    const { username, full_name, phone } = req.body;
    const user = { username, full_name, phone, created_at: new Date() };
    users.push(user);
    res.json({ success: true, user });
});

app.get("/users", (req, res) => res.json(users));

// === DOCTORS ===
// Doctor register
app.post("/doctors/register", async (req, res) => {
    const { username, email, name, specialization, code } = req.body;
    const hashedCode = await bcrypt.hash(code, 10);
    const doctor = { username, email, name, specialization, code: hashedCode, created_at: new Date() };
    doctors.push(doctor);
    res.json({ success: true, doctor });
});

// Doctor login
app.post("/doctors/login", async (req, res) => {
    const { username, code } = req.body;
    const doctor = doctors.find(d => d.username === username);
    if (!doctor) return res.status(401).json({ error: "Doctor not found" });

    const match = await bcrypt.compare(code, doctor.code);
    if (!match) return res.status(401).json({ error: "Invalid code" });

    const token = jwt.sign({ username: doctor.username, role: "doctor" }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ success: true, token });
});


app.get("/doctors", (req, res) => {
    const doctorsWithStats = doctors.map(doc => {
        const answersCount = answers.filter(a => a.doctor_username === doc.username).length;
        return { ...doc, answersCount };
    });
    res.json(doctorsWithStats);
});

// === REQUESTS ===
app.post("/requests/create", (req, res) => {
    const { username, disease, complaint, specialization, assigned_doctor, telegram_id } = req.body;

    const request = {
        id: Date.now().toString(),
        username,
        disease,
        complaint,
        specialization,
        assigned_doctor,
        telegram_id,
        status: "Kutilmoqda",
        created_at: new Date()
    };

    requests.push(request);
    res.json({ success: true, request });
});




app.get("/requests", (req, res) => res.json(requests));

// === REQUEST BY ID ===
app.get("/requests/:id", (req, res) => {
    const { id } = req.params;
    const request = requests.find(r => r.id === id);
    if (!request) {
        return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
});


// Doktorning murojaatlari
app.get("/doctor/requests/:username", (req, res) => {
    const { username } = req.params;
    const doctorRequests = requests.filter(r => r.assigned_doctor === username);
    res.json(doctorRequests);
});

// === ANSWERS ===
app.post("/answers/create", (req, res) => {
    const { request_id, doctor_username, text } = req.body;
    const answer = {
        id: Date.now().toString(),
        request_id,
        doctor_username,
        text,
        created_at: new Date()
    };
    answers.push(answer);

    const reqIndex = requests.findIndex(r => r.id === request_id);
    if (reqIndex !== -1) {
        requests[reqIndex].status = "Javob berildi";
        requests[reqIndex].assigned_doctor = doctor_username;
    }

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

(async () => {
    const hashedCode = await bcrypt.hash("faxriyor123", 10);
    doctors.push({
        username: "dr_faxriyor",
        email: "faxriyor@example.com",
        name: "Dr. Faxriyor",
        specialization: "Therapist",
        code: hashedCode,
        created_at: new Date()
    });
})();




const reqId1 = Date.now().toString();

requests.push({
    id: reqId1,
    username: "user_ali",
    disease: "Yurak og‘rig‘i",
    complaint: "Ko‘krak qafasida og‘riq va tez charchash",
    status: "pending",
    assigned_doctor: "dr_faxriyor",
    created_at: new Date()
});

answers.push({
    id: Date.now().toString(),
    request_id: reqId1,
    doctor_username: "@doctor_ali",
    text: "Paracetamol iching va ko‘proq suyuqlik iching",
    created_at: new Date()
});


answers.push({
    id: Date.now().toString(),
    request_id: reqId1,
    doctor_username: "@doctor_ali",
    text: "Paracetamol iching va ko‘proq suyuqlik iching",
    created_at: new Date()
});
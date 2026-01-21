require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', taskRoutes);

const PORT = 5555;

try {
    app.listen(PORT, () => {
        console.log(`--- Serveren lytter nå på port ${PORT} ---`);
        console.log("Trykk Ctrl+C for å stoppe den.");
    });
} catch (error) {
    console.error("Kunne ikke starte serveren:", error);
}
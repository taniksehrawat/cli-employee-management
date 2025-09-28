const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- Seat data ---
// Example: 10 seats labeled 1 to 10
let seats = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: 'available', // 'available', 'locked', 'booked'
    lockExpires: null
}));

// Helper to clean expired locks
function cleanExpiredLocks() {
    const now = Date.now();
    seats.forEach(seat => {
        if (seat.status === 'locked' && seat.lockExpires <= now) {
            seat.status = 'available';
            seat.lockExpires = null;
        }
    });
}

// --- API Routes ---

// 1. View available seats
app.get('/seats', (req, res) => {
    cleanExpiredLocks();
    const availableSeats = seats.filter(s => s.status === 'available');
    res.json({ availableSeats });
});

// 2. Lock a seat
app.post('/seats/lock/:id', (req, res) => {
    cleanExpiredLocks();
    const seatId = parseInt(req.params.id);
    const seat = seats.find(s => s.id === seatId);

    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    if (seat.status === 'booked') return res.status(400).json({ error: 'Seat already booked' });
    if (seat.status === 'locked') return res.status(400).json({ error: 'Seat already locked' });

    seat.status = 'locked';
    seat.lockExpires = Date.now() + 60 * 1000; // lock expires in 1 min

    res.json({ message: `Seat ${seatId} locked for 1 minute` });
});

// 3. Confirm booking
app.post('/seats/book/:id', (req, res) => {
    cleanExpiredLocks();
    const seatId = parseInt(req.params.id);
    const seat = seats.find(s => s.id === seatId);

    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    if (seat.status !== 'locked') return res.status(400).json({ error: 'Seat is not locked or lock expired' });

    seat.status = 'booked';
    seat.lockExpires = null;

    res.json({ message: `Seat ${seatId} successfully booked` });
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`Ticket booking server running on http://localhost:${PORT}`);
});

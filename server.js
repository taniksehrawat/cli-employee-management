// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory array to store cards
let cards = [];
let nextId = 1; // Auto-increment ID

// --- Routes ---

// GET all cards
app.get('/cards', (req, res) => {
    res.json(cards);
});

// GET a card by ID
app.get('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const card = cards.find(c => c.id === id);
    if (!card) {
        return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
});

// POST a new card
app.post('/cards', (req, res) => {
    const { suit, value } = req.body;

    if (!suit || !value) {
        return res.status(400).json({ error: 'Suit and value are required' });
    }

    const newCard = {
        id: nextId++,
        suit,
        value
    };

    cards.push(newCard);
    res.status(201).json(newCard);
});

// DELETE a card by ID
app.delete('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cards.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Card not found' });
    }

    const removedCard = cards.splice(index, 1);
    res.json({ message: 'Card deleted', card: removedCard[0] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

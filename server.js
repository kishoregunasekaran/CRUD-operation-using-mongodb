const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/personal_information_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const infoSchema = new mongoose.Schema({
    name: String,
    email: String
});
const Info = mongoose.model('Info', infoSchema);

// READ
app.get('/api/information', async (req, res) => {
    try {
        const info = await Info.find();
        res.json(info);
    } catch (err) {
        res.status(500).send(err);
    }
});

//CREATE

app.post('/api/information', async (req, res) => {
    const { name, email } = req.body;
    const info = new Info({ name, email });
    try {
        await info.save();
        res.status(201).send(info);
    } catch (err) {
        res.status(400).send(err);
    }
});

//UPDATE

app.put('/api/information/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const info = await Info.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!info) {
            return res.status(404).send('Information not found');
        }
        res.send(info);
    } catch (err) {
        res.status(400).send(err);
    }
});

//DELETE

app.delete('/api/information/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const info = await Info.findByIdAndDelete(id);
        if (!info) {
            return res.status(404).send('Information not found');
        }
        res.send(info);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Server
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const todos = require('./Models/todos.js');
const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();

const uri = process.env.mongodb_uri;
mongoose.connect(uri);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database Connected");
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/todo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'todo.html'));
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submitted.html'));
});

app.get('/todo/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewtodo.html'));
});
app.get('/update/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
})


app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        const result = await todos.create(data);
        console.log(result);
        res.status(201).redirect('/thank-you');
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});

app.get('/api/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const details = await todos.findOne({ todoId: id });
        if (details) {
            res.json(details);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update a document by ID
app.put('/api/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const updatedDetails = await todos.findOneAndUpdate({ todoId: id }, updatedData, options);

        if (updatedDetails) {
            res.status(200).json(updatedDetails);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a document by ID
app.delete('/api/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedDetails = await todos.findOneAndDelete({ todoId: id });

        if (deletedDetails) {
            res.status(200).json({ message: 'Todo deleted successfully' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

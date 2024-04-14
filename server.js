//server.js
import * as dotenv from 'dotenv';
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


// Establishing Port
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true });

	
// Define Note model
const Note = mongoose.model("Note", {
    title: String,
    content: String,

});

// Listen for successful MongoDB connection
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

// Routes
app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});
 
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Update Note by ID
app.put("/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;
 
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});
 
// Delete Note by ID
app.delete("/notes/:id", async (req, res) => {
    const noteId = req.params.id;
 
    try {
        await Note.findByIdAndDelete(noteId);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});
 
// Create Note
app.post("/notes", async (req, res) => {
    const { title, content } = req.body;
 
    const note = new Note({ title, content });
 
    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});

//server.js

// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const bodyParser = require('body-parser');

// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// console.log('here...', path.resolve(__dirname, '../.env'), process.env.MONGO_URI)


// Establishing Port
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
//  const corsOptions = {
//      origin: 'https://my-note-app-38wr.onrender.com/',//(https://your-client-app.com)
//     optionsSuccessStatus: 200,
//  };
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://my-note-app-38wr.onrender.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDB connection

// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://scrumpler11:Niecey213@cluster0.ytysgnv.mongodb.net/';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// Routes
app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});
 
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// Update Note by ID
app.put("/api/notes/:id", async (req, res) => {
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
app.delete("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;
 
    try {
        await Note.findByIdAndDelete(noteId);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});
 
// Create Note
app.post("/api/notes", async (req, res) => {
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

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("SERVER STARTED");

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Model
const Task = mongoose.model("Task", {
  text: String,
  startTime: String,
  endTime: String
});

// GET ALL
app.get("/api/tasks", async (req, res) => {
  console.log("GET TASKS");
  const tasks = await Task.find().sort({ _id: -1 });
  res.json(tasks);
});

// ADD
app.post("/api/add", async (req, res) => {
  console.log("ADD:", req.body);

  const { text, startTime, endTime } = req.body;

  const task = new Task({ text, startTime, endTime });
  await task.save();

  res.json(task);
});

// DELETE
app.delete("/api/delete/:id", async (req, res) => {
  console.log("DELETE:", req.params.id);

  await Task.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// CLEAR (optional)
app.get("/api/clear", async (req, res) => {
  await Task.deleteMany({});
  res.send("All cleared");
});

// START
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
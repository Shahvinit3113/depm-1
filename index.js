const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware
require("dotenv").config();
app.use(cors());
app.use(express.json());

// Database connection
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
});

const handleError = (res, error) => {
  console.log("Error", error.message || error);
  res.status(500).json({ error: "Internal Server Error" });
};

// Get student list
app.get("/student-list", (req, res) => {
  const sql = "SELECT * FROM student ORDER BY Name ASC";
  db.query(sql, (err, data) => {
    if (err) return handleError(res, err);
    if (!data.length)
      return res.status(404).json({ Error: "There is no Data." });
    res.json(data);
  });
});

// Add student
app.post("/add-student", (req, res) => {
  const id = uuidv4();

  const { name, email, number } = req.body;

  if ((!name, !email, !number)) {
    return res.status(400).json({ Error: "Fields are required." });
  }

  const sql = "INSERT INTO student (Name, Email, Number, ID) VALUES (?)";
  const values = [name, email, number, id];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json("Error");
    return res.status(201).json({ message: "Student is created." });
  });
});

app.put("/edit-student/:id", (req, res) => {
  const { Name, Email, Number } = req.body;
  const id = req.params.id;
  const sql = `UPDATE student SET Name= ?, Email = ?, Number= ? WHERE ID = ?`;
  const values = [Name, Email, Number, id];
  db.query(sql, values, (err, data) => {
    if (err) return handleError(res, err);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    return res.json({ message: "Student updated successfull." });
  });
});

app.delete("/delete-student/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM student WHERE ID = ${id}`;
  db.query(sql, (err, data) => {
    if (err) return handleError(res, err);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json({ message: "Student deleted successfully." });
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server Established on port ${process.env.PORT}`);
});

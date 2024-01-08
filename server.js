// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "googleforms",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/forms", (req, res) => {
  // Handle form creation, insert into the database
  const { fields } = req.body;
  // Assuming your database has a table named 'forms' with columns 'id' and 'fields'
  db.query(
    "INSERT INTO forms (fields) VALUES (?)",
    [JSON.stringify(fields)],
    (err, result) => {
      if (err) {
        console.error("Error creating form:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(201).json({ id: result.insertId });
    }
  );
});

app.get("/forms/:id/details", (req, res) => {
  // Fetch form details by form ID
  const formId = req.params.id;
  // Assuming your database has a table named 'forms' with columns 'id' and 'fields'
  db.query("SELECT fields FROM forms WHERE id = ?", [formId], (err, result) => {
    if (err) {
      console.error("Error fetching form details:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Form not found" });
      return;
    }
    const formDetails = JSON.parse(result[0].fields);
    res.json({ fields: formDetails });
  });
});

app.post("/form-responses", (req, res) => {
  // Handle form responses, insert into the database
  const { formId, userId, responses } = req.body;
  // Assuming your database has a table named 'responses' with columns 'form_id', 'user_id', and 'responses'
  db.query(
    "INSERT INTO responses (form_id, user_id, responses) VALUES (?, ?, ?)",
    [formId, userId, JSON.stringify(responses)],
    (err) => {
      if (err) {
        console.error("Error submitting form response:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(201).json({ message: "Form response submitted successfully" });
    }
  );
});

app.get("/forms/:id/responses", (req, res) => {
  // Fetch form responses by form ID
  const formId = req.params.id;
  // Assuming your database has a table named 'responses' with columns 'form_id', 'user_id', and 'responses'
  db.query(
    "SELECT user_id, responses FROM responses WHERE form_id = ?",
    [formId],
    (err, result) => {
      if (err) {
        console.error("Error fetching form responses:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ responses: result });
    }
  );
});

// Server listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM forms";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch forms" });
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { name, description, schema } = req.body;

  if (!name || !schema) {
    return res.status(400).json({ error: "Name and schema are required" });
  }

  const sql =
    "INSERT INTO forms (name, description, `schema`) VALUES (?, ?, ?)";
  const values = [name, description, JSON.stringify(schema)];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create form" });
    res.json({ message: "Form created successfully", id: result.insertId });
  });
});

router.put("/:id/schema", (req, res) => {
  const { id } = req.params;
  const { schema } = req.body;

  if (!schema) {
    return res.status(400).json({ error: "Schema is required" });
  }

  const sql =
    "UPDATE forms SET `schema` = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
  const values = [JSON.stringify(schema), id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating form schema:", err);
      return res.status(500).json({ error: "Failed to update form schema" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ message: "Form schema updated successfully" });
  });
});

router.post("/:id/submissions", (req, res) => {
  const { id } = req.params;
  const { submission_data } = req.body;

  if (!submission_data) {
    return res.status(400).json({ error: "Submission data is required" });
  }

  const sql =
    "INSERT INTO form_submissions (form_id, submission_data) VALUES (?, ?)";
  const values = [id, JSON.stringify(submission_data)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error saving submission:", err);
      return res.status(500).json({ error: "Failed to save submission" });
    }

    res.json({
      message: "Submission saved successfully",
      id: result.insertId,
    });
  });
});

module.exports = router;

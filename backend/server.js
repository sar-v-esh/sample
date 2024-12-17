const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client } = require("pg");
app.use(cors());
app.use(bodyParser.json());
const port = 5000;
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Employeedb",
  password: "sarvesh#23",
  port: 5433,
});

client.connect();

app.use(express.json());

app.get("/api/employees", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM employees");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Error fetching employees" });
  }
});

app.post("/api/employees", async (req, res) => {
  const { name, employeeId, email, phone, department, dateOfJoining, role } =
    req.body;

  try {
    const duplicateCheckQuery =
      "SELECT * FROM employees WHERE employee_id = $1 OR email = $2";
    const duplicate = await client.query(duplicateCheckQuery, [
      employeeId,
      email,
    ]);
    if (duplicate.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Employee ID or Email already exists" });
    }

    const query = `
        INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
    await client.query(query, [
      name,
      employeeId,
      email,
      phone,
      department,
      dateOfJoining,
      role,
    ]);

    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Error adding employee" });
  }
});

/*app.put("/api/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const result = await pool.query(
      "UPDATE your_table SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: "Error updating data" }); };*/

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM employees WHERE employee_id = $1", [id]);
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting data" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

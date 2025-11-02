import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- ROTAS PRINCIPAIS ---

// Pessoas (currículos)
app.get("/people", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM person");
  res.json(rows);
});

app.get("/people/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM person WHERE id=$1", [id]);
  res.json(rows[0]);
});

app.post("/people", async (req, res) => {
  const { name, title, summary } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO person (name, title, summary) VALUES ($1,$2,$3) RETURNING *",
    [name, title, summary]
  );
  res.status(201).json(rows[0]);
});

app.put("/people/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, summary } = req.body;
  const { rows } = await pool.query(
    "UPDATE person SET name=$1, title=$2, summary=$3 WHERE id=$4 RETURNING *",
    [name, title, summary, id]
  );
  res.json(rows[0]);
});

app.delete("/people/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM person WHERE id=$1", [id]);
  res.json({ message: "Pessoa removida com sucesso!" });
});

// Health check
app.get("/", (req, res) => {
  res.send("CV API rodando 🚀");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

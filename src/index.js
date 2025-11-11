import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const { Pool } = pkg;
const app = express();
 

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- Rota Raiz (Health Check) ---
app.get("/", (req, res) => {
  res.send("CV API rodando com sucesso!");
});

// === CRUD PESSOA ===

// GET /people (Listar todas)
app.get("/people", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM person ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro no GET /people:", error);
    res.status(500).json({ mensagem: "Erro ao listar pessoas." });
  }
});

// GET /people/:id (Buscar uma)
app.get("/people/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM person WHERE id=$1", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro no GET /people/${id}:`, error);
    res.status(500).json({ mensagem: "Erro ao buscar pessoa por ID." });
  }
});

// POST /people (Criar)
app.post("/people", async (req, res) => {
  const { name, title, summary } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO person (name, title, summary) VALUES ($1,$2,$3) RETURNING *",
      [name, title, summary]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro no POST /people:", error);
    res.status(500).json({ mensagem: "Falha na inserção de dados." });
  }
});

// PUT /people/:id (Atualizar)
app.put("/people/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, summary } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE person SET name=$1, title=$2, summary=$3 WHERE id=$4 RETURNING *",
      [name, title, summary, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro no PUT /people/${id}:`, error);
    res.status(500).json({ mensagem: "Erro ao atualizar pessoa." });
  }
});

// DELETE /people/:id (Deletar)
app.delete("/people/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM person WHERE id=$1", [id]);
    res.json({ message: "Pessoa removida com sucesso!" });
  } catch (error) {
    console.error(`Erro no DELETE /people/${id}:`, error);
    res.status(500).json({ mensagem: "Erro ao deletar pessoa." });
  }
});

// === CRUD EXPERIÊNCIA (RELACIONADO COM PESSOA) ===

// GET /people/:id/experience (Listar experiências de UMA pessoa)
app.get("/people/:id/experience", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM experience WHERE person_id=$1", [id]);
    res.json(rows);
  } catch (error) {
    console.error("Erro no GET /experience:", error);
    res.status(500).json({ mensagem: "Erro ao listar experiências." });
  }
});

// POST /people/:id/experience (Adicionar experiência para UMA pessoa)
app.post("/people/:id/experience", async (req, res) => {
  const { id: person_id } = req.params;
  const { title, company, dates, description } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO experience (title, company, dates, description, person_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, company, dates, description, person_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro no POST /experience:", error);
    res.status(500).json({ mensagem: "Erro ao adicionar experiência." });
  }
});

// PUT /experience/:exp_id (Atualizar UMA experiência específica)
app.put("/experience/:exp_id", async (req, res) => {
  const { exp_id } = req.params;
  const { title, company, dates, description } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE experience SET title=$1, company=$2, dates=$3, description=$4 WHERE id=$5 RETURNING *",
      [title, company, dates, description, exp_id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro no PUT /experience/${exp_id}:`, error);
    res.status(500).json({ mensagem: "Erro ao atualizar experiência." });
  }
});

// DELETE /experience/:exp_id (Deletar UMA experiência específica)
app.delete("/experience/:exp_id", async (req, res) => {
  const { exp_id } = req.params;
  try {
    await pool.query("DELETE FROM experience WHERE id=$1", [exp_id]);
    res.json({ message: "Experiência removida com sucesso!" });
  } catch (error) {
    console.error(`Erro no DELETE /experience/${exp_id}:`, error);
    res.status(500).json({ mensagem: "Erro ao deletar experiência." });
  }
});


// === CRUD EDUCAÇÃO (RELACIONADO COM PESSOA) ===
// (Similar ao de Experiência)

// GET /people/:id/education
app.get("/people/:id/education", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM education WHERE person_id=$1", [id]);
    res.json(rows);
  } catch (error) {
    console.error("Erro no GET /education:", error);
    res.status(500).json({ mensagem: "Erro ao listar educação." });
  }
});

// POST /people/:id/education
app.post("/people/:id/education", async (req, res) => {
  const { id: person_id } = req.params;
  const { degree, school, dates } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO education (degree, school, dates, person_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [degree, school, dates, person_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro no POST /education:", error);
    res.status(500).json({ mensagem: "Erro ao adicionar educação." });
  }
});

// PUT /education/:edu_id
app.put("/education/:edu_id", async (req, res) => {
  const { edu_id } = req.params;
  const { degree, school, dates } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE education SET degree=$1, school=$2, dates=$3 WHERE id=$4 RETURNING *",
      [degree, school, dates, edu_id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erro no PUT /education/${edu_id}:`, error);
    res.status(500).json({ mensagem: "Erro ao atualizar educação." });
  }
});

// DELETE /education/:edu_id
app.delete("/education/:edu_id", async (req, res) => {
  const { edu_id } = req.params;
  try {
    await pool.query("DELETE FROM education WHERE id=$1", [edu_id]);
    res.json({ message: "Educação removida com sucesso!" });
  } catch (error) {
    console.error(`Erro no DELETE /education/${edu_id}:`, error);
    res.status(500).json({ mensagem: "Erro ao deletar educação." });
  }
});

 
export default app;
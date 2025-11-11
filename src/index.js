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
  // CORREÇÃO CRÍTICA DO SSL/TLS PARA AMBIENTES DE NUVEM
  ssl: {
    rejectUnauthorized: false
  }
});

// --- ROTAS PRINCIPAIS ---

// 1. Listar Pessoas (GET)
app.get("/people", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM person");
    res.json(rows);
  } catch (error) {
    console.error("Erro no GET /people:", error);
    res.status(500).json({ mensagem: "Erro ao listar pessoas." });
  }
});

// 2. Buscar Pessoa por ID (GET)
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

// 3. Criar Pessoa (POST) - AGORA COM TRATAMENTO DE ERRO
app.post("/people", async (req, res) => {
  const { name, title, summary } = req.body;
  
  try {
    const { rows } = await pool.query(
      "INSERT INTO person (name, title, summary) VALUES ($1,$2,$3) RETURNING *",
      [name, title, summary]
    );
    // Retorna 201 Created e o item com o ID gerado
    res.status(201).json(rows[0]); 

  } catch (error) {
    // CAPTURA o erro do PostgreSQL e mostra no terminal
    console.error("Erro no POST /people:", error); 
    
    // Retorna 500 para o cliente, com a mensagem de erro para debug
    res.status(500).json({ 
      mensagem: "Falha na inserção de dados. Verifique o terminal para o erro SQL.", 
      detalhes: error.message 
    });
  }
});

// 4. Atualizar Pessoa (PUT)
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

// 5. Deletar Pessoa (DELETE)
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

// Health check
app.get("/", (req, res) => {
  res.send("CV API rodando 🚀");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import livrosRoutes from "./routes/livrosRoutes.js";
import usuariosRoutes from "./routes/UsuariosRoutes.js";
import emprestimosRoutes from "./routes/EmprestimosRoutes.js";

import db from "./db/db.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/livros", livrosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/emprestimos", emprestimosRoutes);

// Testar conexão com o banco ao iniciar
async function testarConexao() {
  try {
    await db.query("SELECT 1");
    console.log("Conectado ao banco de dados!");
  } catch (err) {
    console.error("Erro ao conectar no banco:", err.message);
  }
}

app.listen(3000, async () => {
  console.log("Servidor rodando na porta 3000");
  await testarConexao();
});

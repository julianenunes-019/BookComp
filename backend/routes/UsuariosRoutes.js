
import express from "express";

import {
  cadastrar,
  login,
  consultarPerfil,
  atualizarPerfil
} from "../controllers/UsuariosController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Cadastrar usuário
router.post("/cadastrar", cadastrar);

// Fazer login
router.post("/login", login);

// Consultar perfil (rota protegida)
router.get("/perfil", authMiddleware, consultarPerfil);

// Atualizar perfil (rota protegida)
router.put("/perfil", authMiddleware, atualizarPerfil);

export default router;

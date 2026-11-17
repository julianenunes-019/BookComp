import express from "express";
import LivrosController from "../controllers/LivrosController.js";

const router = express.Router();

router.get("/buscar", LivrosController.buscarLivro);
router.get("/", LivrosController.listarLivros);
router.post("/cadastrar", LivrosController.cadastrarLivro);
router.put("/editar/:id", LivrosController.atualizarLivro);
router.put("/status/:id", LivrosController.atualizarStatus);
router.delete("/deletar/:id", LivrosController.deletarLivro);

export default router;
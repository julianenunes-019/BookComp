
import express from "express";
import EmprestimosController from "../controllers/EmprestimosController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, EmprestimosController.cadastrar);

router.get("/meus", authMiddleware, EmprestimosController.meusEmprestimos);

router.put("/cancelar/:id", authMiddleware, EmprestimosController.cancelar);

export default router;

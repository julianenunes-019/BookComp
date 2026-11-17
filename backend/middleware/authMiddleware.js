
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
      return res.status(401).json({
        mensagem: "Faça login para continuar."
      });
    }

    const token = autorizacao.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        mensagem: "Token não informado."
      });
    }

    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = dados;

    next();

  } catch (erro) {
    return res.status(401).json({
      mensagem: "Sessão inválida ou expirada."
    });
  }
}

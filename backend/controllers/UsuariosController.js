
import db from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CADASTRAR USUÁRIO
export async function cadastrar(req, res) {
  try {
    const { nome, email, senha, data_nascimento, sexo } = req.body;

    if (!nome || !email || !senha || !data_nascimento || !sexo) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos."
      });
    }

    const [usuarioExistente] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarioExistente.length > 0) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      `INSERT INTO usuarios (nome, email, senha, data_nascimento, sexo)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, senhaHash, data_nascimento, sexo]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!"
    });

  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário."
    });
  }
}

// FAZER LOGIN
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha."
      });
    }

    const [usuarios] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    return res.status(500).json({
      mensagem: "Erro ao fazer login."
    });
  }
}

// CONSULTAR PERFIL
export async function consultarPerfil(req, res) {
  try {
    const id = req.usuario.id;

    const [usuarios] = await db.query(
      `SELECT id, nome, email, data_nascimento, sexo
       FROM usuarios
       WHERE id = ?`,
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    return res.status(200).json(usuarios[0]);

  } catch (erro) {
    console.error("Erro ao consultar perfil:", erro);
    return res.status(500).json({
      mensagem: "Erro ao consultar perfil."
    });
  }
}

// ATUALIZAR PERFIL
export async function atualizarPerfil(req, res) {
  try {
    const id = req.usuario.id;

    const { nome, data_nascimento, sexo, senha } = req.body;

    if (!nome || !data_nascimento || !sexo) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    if (senha && senha.trim().length < 6) {
      return res.status(400).json({
        mensagem: "A senha deve ter pelo menos 6 caracteres."
      });
    }

    if (senha && senha.trim() !== "") {
      const senhaHash = await bcrypt.hash(senha, 10);

      await db.query(
        `UPDATE usuarios
         SET nome = ?, data_nascimento = ?, sexo = ?, senha = ?
         WHERE id = ?`,
        [nome, data_nascimento, sexo, senhaHash, id]
      );

    } else {
      await db.query(
        `UPDATE usuarios
         SET nome = ?, data_nascimento = ?, sexo = ?
         WHERE id = ?`,
        [nome, data_nascimento, sexo, id]
      );
    }

    const [usuarios] = await db.query(
      `SELECT id, nome, email, data_nascimento, sexo
       FROM usuarios
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      mensagem: "Perfil atualizado com sucesso!",
      usuario: usuarios[0]
    });

  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    return res.status(500).json({
      mensagem: "Erro ao atualizar perfil."
    });
  }
}

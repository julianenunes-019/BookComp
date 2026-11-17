
import axios from "axios";
import db from "../db/db.js";

class LivrosController {

  // Buscar livros na API Open Library
  static async buscarLivro(req, res) {
    try {
      const { titulo } = req.query;

      if (!titulo || !titulo.trim()) {
        return res.json([]);
      }

      const resposta = await axios.get(
        "https://openlibrary.org/search.json",
        {
          params: {
            title: titulo,
            limit: 20
          }
        }
      );

      const livros = resposta.data.docs || [];

      const resultado = livros
        .filter(livro => livro.cover_i)
        .map(livro => ({
          titulo: livro.title,
          autor: livro.author_name?.join(", ") || "Desconhecido",
          ano: livro.first_publish_year || 0,
          capa: `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`,
          detalhes: livro.key || null
        }));

      return res.json(resultado);

    } catch (err) {
      console.error("Erro na busca:", err.message);

      return res.status(500).json({
        erro: "Não foi possível buscar os livros na API."
      });
    }
  }

  // Cadastrar livro no acervo
  static async cadastrarLivro(req, res) {
    try {
      const {
        titulo,
        autor,
        ano,
        capa,
        detalhes,
        quantidade_estoque
      } = req.body;

      if (!titulo || !autor || !capa) {
        return res.status(400).json({
          erro: "Dados do livro incompletos."
        });
      }

      const quantidade = Number(quantidade_estoque);

      if (!Number.isInteger(quantidade) || quantidade < 0) {
        return res.status(400).json({
          erro: "Informe uma quantidade válida de exemplares."
        });
      }

      const sql = `
        INSERT INTO livros
        (titulo, autor, ano, capa, status, detalhes, quantidade_estoque)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute(sql, [
        titulo,
        autor,
        ano || 0,
        capa,
        "disponível",
        detalhes || null,
        quantidade
      ]);

      return res.status(201).json({
        mensagem: "Livro adicionado ao acervo com sucesso!",
        id_Livros: result.insertId
      });

    } catch (err) {
      console.error("Erro ao cadastrar:", err.message);

      return res.status(500).json({
        erro: err.message
      });
    }
  }

  // Listar livros do acervo
  static async listarLivros(req, res) {
    try {
      const [livros] = await db.execute(
        "SELECT * FROM livros ORDER BY id_Livros DESC"
      );

      return res.json(livros);

    } catch (err) {
      console.error("Erro ao listar livros:", err.message);

      return res.status(500).json({
        erro: err.message
      });
    }
  }

  // Editar informações de um livro
  static async atualizarLivro(req, res) {
    try {
      const { id } = req.params;

      const {
        titulo,
        autor,
        ano,
        capa,
        quantidade_estoque
      } = req.body;

      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
          erro: "ID do livro inválido."
        });
      }

      const [livros] = await db.execute(
        "SELECT id_Livros FROM livros WHERE id_Livros = ?",
        [id]
      );

      if (livros.length === 0) {
        return res.status(404).json({
          erro: "Livro não encontrado."
        });
      }

      const quantidade = Number(quantidade_estoque);
      const anoLivro = Number(ano);

      if (
        !titulo?.trim() ||
        !autor?.trim() ||
        !capa?.trim()
      ) {
        return res.status(400).json({
          erro: "Preencha todos os dados do livro."
        });
      }

      if (!Number.isInteger(quantidade) || quantidade < 0) {
        return res.status(400).json({
          erro: "Informe uma quantidade válida de exemplares."
        });
      }

      if (!Number.isInteger(anoLivro) || anoLivro < 0) {
        return res.status(400).json({
          erro: "Informe um ano válido."
        });
      }

      await db.execute(
        `UPDATE livros
         SET titulo = ?, autor = ?, ano = ?,
             capa = ?, quantidade_estoque = ?
         WHERE id_Livros = ?`,
        [
          titulo.trim(),
          autor.trim(),
          anoLivro,
          capa.trim(),
          quantidade,
          id
        ]
      );

      return res.json({
        mensagem: "Livro atualizado com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao atualizar livro:", err.message);

      return res.status(500).json({
        erro: "Não foi possível atualizar o livro."
      });
    }
  }

  // Atualizar status do livro
  static async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [result] = await db.execute(
        "UPDATE livros SET status = ? WHERE id_Livros = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          erro: "Livro não encontrado."
        });
      }

      return res.json({
        mensagem: "Status atualizado com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao atualizar status:", err.message);

      return res.status(500).json({
        erro: err.message
      });
    }
  }

  // Deletar livro
  static async deletarLivro(req, res) {
    try {
      const { id } = req.params;

      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
          erro: "ID do livro inválido."
        });
      }

      const [result] = await db.execute(
        "DELETE FROM livros WHERE id_Livros = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          erro: "Livro não encontrado."
        });
      }

      return res.json({
        mensagem: "Livro removido com sucesso!"
      });

    } catch (err) {
      console.error("Erro ao deletar livro:", err.message);

      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({
          erro: "Não é possível excluir este livro porque existem empréstimos registrados."
        });
      }

      return res.status(500).json({
        erro: "Não foi possível excluir o livro."
      });
    }
  }
}

export default LivrosController;

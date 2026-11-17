
import db from "../db/db.js";

class EmprestimosController {

  // Solicitar empréstimo
  static async cadastrar(req, res) {
    const conexao = await db.getConnection();

    try {
      const usuario_id = req.usuario.id;
      const { livro_id, quantidade } = req.body;

      if (
        !Number.isInteger(Number(livro_id)) ||
        Number(livro_id) <= 0 ||
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0
      ) {
        return res.status(400).json({
          erro: "Informe um livro e uma quantidade válida."
        });
      }

      await conexao.beginTransaction();

      // Verificar o livro e bloquear a linha durante a operação
      const [livros] = await conexao.execute(
        "SELECT * FROM livros WHERE id_Livros = ? FOR UPDATE",
        [livro_id]
      );

      if (livros.length === 0) {
        await conexao.rollback();
        return res.status(404).json({
          erro: "Livro não encontrado."
        });
      }

      if (Number(quantidade) > livros[0].quantidade_estoque) {
        await conexao.rollback();
        return res.status(400).json({
          erro: "Quantidade maior que o estoque disponível."
        });
      }

      // Registrar empréstimo
      await conexao.execute(
        `INSERT INTO emprestimos
        (usuario_id, livro_id, quantidade, status)
        VALUES (?, ?, ?, 'Pendente')`,
        [usuario_id, livro_id, quantidade]
      );

      // Atualizar estoque
      await conexao.execute(
        `UPDATE livros
         SET quantidade_estoque = quantidade_estoque - ?
         WHERE id_Livros = ?`,
        [quantidade, livro_id]
      );

      await conexao.commit();

      return res.status(201).json({
        mensagem: "Empréstimo solicitado com sucesso!"
      });

    } catch (err) {
      await conexao.rollback();

      console.error("Erro ao solicitar empréstimo:", err.message);

      return res.status(500).json({
        erro: "Não foi possível solicitar o empréstimo."
      });

    } finally {
      conexao.release();
    }
  }

  // Listar empréstimos do usuário logado
  static async meusEmprestimos(req, res) {
    try {
      const usuario_id = req.usuario.id;

      const [emprestimos] = await db.execute(
        `SELECT e.*, l.titulo, l.autor, l.capa
         FROM emprestimos e
         INNER JOIN livros l ON e.livro_id = l.id_Livros
         WHERE e.usuario_id = ?
         ORDER BY e.data_hora DESC`,
        [usuario_id]
      );

      return res.json(emprestimos);

    } catch (err) {
      console.error("Erro ao listar empréstimos:", err.message);

      return res.status(500).json({
        erro: "Não foi possível listar os empréstimos."
      });
    }
  }

  // Cancelar empréstimo pendente
  static async cancelar(req, res) {
    const conexao = await db.getConnection();

    try {
      const usuario_id = req.usuario.id;
      const { id } = req.params;

      await conexao.beginTransaction();

      const [emprestimos] = await conexao.execute(
        `SELECT * FROM emprestimos
         WHERE id = ? AND usuario_id = ? AND status = 'Pendente'
         FOR UPDATE`,
        [id, usuario_id]
      );

      if (emprestimos.length === 0) {
        await conexao.rollback();
        return res.status(404).json({
          erro: "Empréstimo não encontrado ou não pode ser cancelado."
        });
      }

      const emprestimo = emprestimos[0];

      await conexao.execute(
        `UPDATE emprestimos
         SET status = 'Cancelado'
         WHERE id = ?`,
        [id]
      );

      await conexao.execute(
        `UPDATE livros
         SET quantidade_estoque = quantidade_estoque + ?
         WHERE id_Livros = ?`,
        [emprestimo.quantidade, emprestimo.livro_id]
      );

      await conexao.commit();

      return res.json({
        mensagem: "Empréstimo cancelado e estoque atualizado!"
      });

    } catch (err) {
      await conexao.rollback();

      console.error("Erro ao cancelar empréstimo:", err.message);

      return res.status(500).json({
        erro: "Não foi possível cancelar o empréstimo."
      });

    } finally {
      conexao.release();
    }
  }
}

export default EmprestimosController;

import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function Perfil({ voltar, atualizarUsuario }) {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    data_nascimento: "",
    sexo: "",
    senha: ""
  });

  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const resposta = await axios.get(
          `${API}/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setDados({
          nome: resposta.data.nome || "",
          email: resposta.data.email || "",
          data_nascimento: resposta.data.data_nascimento
            ? String(resposta.data.data_nascimento).slice(0, 10)
            : "",
          sexo: resposta.data.sexo || "",
          senha: ""
        });
      } catch (err) {
        console.error(err);
        setMensagem("Não foi possível carregar seu perfil.");
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [token]);

  const alterarCampo = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value
    });
  };

  const salvarPerfil = async (e) => {
    e.preventDefault();

    try {
      const resposta = await axios.put(
        `${API}/usuarios/perfil`,
        {
          nome: dados.nome,
          data_nascimento: dados.data_nascimento,
          sexo: dados.sexo,
          senha: dados.senha
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const usuarioAtualizado = resposta.data.usuario;

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAtualizado)
      );

      atualizarUsuario(usuarioAtualizado);

      setDados({
        ...dados,
        senha: ""
      });

      setMensagem("Perfil atualizado com sucesso!");
      setErro(false);

    } catch (err) {
      console.error(err);
      setMensagem(
        err.response?.data?.mensagem ||
        "Não foi possível atualizar seu perfil."
      );
      setErro(true);
    }
  };

  if (loading) {
    return <p className="loading-msg">Carregando perfil...</p>;
  }

  return (
    <section className="section perfil-container">
      <div className="perfil-heading">
        <div>
          <h2>Meu Perfil</h2>
          <p>Gerencie suas informações de administrador.</p>
        </div>
      </div>

      <div className="perfil-card">
        <div className="perfil-card-header">
          <div className="perfil-avatar">
            {dados.nome ? dados.nome.charAt(0).toUpperCase() : "A"}
          </div>

          <div>
            <h3>{dados.nome || "Administrador"}</h3>
            <p>Administrador da biblioteca</p>
          </div>
        </div>

        {mensagem && (
          <p className={erro ? "mensagem-erro" : "mensagem-sucesso"}>
            {mensagem}
          </p>
        )}

        <form className="perfil-form" onSubmit={salvarPerfil}>
          <div className="perfil-form-title">
            <h3>Dados pessoais</h3>
            <p>Atualize seus dados de acesso e identificação.</p>
          </div>

          <div className="perfil-fields">
            <div className="perfil-field">
              <label>Nome completo</label>
              <input
                type="text"
                name="nome"
                value={dados.nome}
                onChange={alterarCampo}
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div className="perfil-field">
              <label>E-mail</label>
              <input
                type="email"
                value={dados.email}
                disabled
              />
              <small>O e-mail não pode ser alterado.</small>
            </div>

            <div className="perfil-field">
              <label>Data de nascimento</label>
              <input
                type="date"
                name="data_nascimento"
                value={dados.data_nascimento}
                onChange={alterarCampo}
                required
              />
            </div>

            <div className="perfil-field">
              <label>Sexo</label>
              <select
                name="sexo"
                value={dados.sexo}
                onChange={alterarCampo}
                required
              >
                <option value="">Selecione</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="perfil-field perfil-senha">
              <label>Nova senha</label>
              <input
                type="password"
                name="senha"
                value={dados.senha}
                onChange={alterarCampo}
                placeholder="Deixe vazio para manter a senha atual"
              />
              <small>Preencha somente se desejar alterar sua senha.</small>
            </div>
          </div>

          <div className="perfil-actions">
            <button type="button" className="perfil-btn voltar" onClick={voltar}>
              Voltar
            </button>

            <button type="submit" className="perfil-btn salvar">
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
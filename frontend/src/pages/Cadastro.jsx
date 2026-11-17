
import { useState } from "react";
import axios from "axios";

export default function Cadastro({ irParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const cadastrarUsuario = async (e) => {
    e.preventDefault();

    setMensagem("");

    try {
      await axios.post(
        "http://localhost:3000/usuarios/cadastrar",
        {
          nome,
          email,
          senha,
          data_nascimento: dataNascimento,
          sexo
        }
      );

      setTipoMensagem("sucesso");
      setMensagem("Cadastro realizado com sucesso!");

    } catch (erro) {
      setTipoMensagem("erro");
      setMensagem(
        erro.response?.data?.mensagem ||
        "Não foi possível realizar o cadastro."
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={cadastrarUsuario}>
        <h1>BookComp</h1>
        <h2>Criar uma conta</h2>

        {mensagem && (
          <div
            className={`notificacao ${tipoMensagem}`}
            role="alert"
          >
            <span>{mensagem}</span>

            <button
              type="button"
              onClick={() => {
                setMensagem("");

                if (tipoMensagem === "sucesso") {
                  irParaLogin();
                }
              }}
            >
              Fechar
            </button>
          </div>
        )}

        <label>Nome completo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
        />

        <label>Data de nascimento</label>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
        />

        <label>Sexo</label>
        <select
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="Outro">Outro</option>
          <option value="Prefiro não informar">Prefiro não informar</option>
        </select>

        <button type="submit">Cadastrar</button>

        <p>
          Já tem uma conta?
          <button type="button" onClick={irParaLogin}>
            Fazer login
          </button>
        </p>
      </form>
    </div>
  );
}

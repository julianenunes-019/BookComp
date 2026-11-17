
import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function Login({ aoEntrar, irParaCadastro, notificar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const fazerLogin = async (e) => {
    e.preventDefault();

    setMensagem("");

    try {
      const resposta = await axios.post(
        "http://localhost:3000/usuarios/login",
        { email, senha }
      );

      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.data.usuario)
      );

      notificar("Login realizado com sucesso!", "sucesso");
      aoEntrar();

    } catch (erro) {
      setMensagem(
        erro.response?.data?.mensagem ||
        erro.response?.data?.erro ||
        "E-mail ou senha incorretos."
      );

      setTipoMensagem("erro");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={fazerLogin}>

        <img
          src={logo}
          alt="Logo BookComp"
          className="auth-logo"
        />

        <h1>BookComp</h1>
        <h2>Entrar na sua conta</h2>

        {mensagem && (
          <div className={`notificacao ${tipoMensagem}`} role="alert">
            <span>{mensagem}</span>

            <button
              type="button"
              onClick={() => {
                setMensagem("");
                setTipoMensagem("");
              }}
            >
              Fechar
            </button>
          </div>
        )}

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
        />

        <button type="submit">Entrar</button>

        <p>
          Ainda não tem conta?
          <button type="button" onClick={irParaCadastro}>
            Cadastre-se
          </button>
        </p>

      </form>
    </div>
  );
}

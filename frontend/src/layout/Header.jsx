import logo from "../assets/logo.png";

export default function Header({
  pagina,
  setPagina,
  abrirEmprestimos,
  carregarMeusEmprestimos,
  abrirPerfil,
  sair
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="BookComp Logo" className="logo" />

        <div>
          <h1>BookComp</h1>
          <p>Biblioteca Inteligente</p>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <p className="sidebar-label">MENU PRINCIPAL</p>

      <nav className="sidebar-actions">
        <button
          className={`sidebar-btn ${pagina === "busca" ? "active" : ""}`}
          onClick={() => setPagina("busca")}
        >
          <span>⌂</span>
          Início
        </button>

        <button
          className={`sidebar-btn ${pagina === "emprestimos" ? "active" : ""}`}
          onClick={abrirEmprestimos}
        >
          <span>▤</span>
          Acervo de livros
        </button>

        <button
          className={`sidebar-btn ${pagina === "meusEmprestimos" ? "active" : ""}`}
          onClick={carregarMeusEmprestimos}
        >
          <span>▣</span>
          Empréstimos
        </button>

        <button
          className={`sidebar-btn ${pagina === "perfil" ? "active" : ""}`}
          onClick={abrirPerfil}
        >
          <span>♙</span>
          Meu perfil
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-btn sair-btn" onClick={sair}>
          <span>↪</span>
          Sair da conta
        </button>

        <p>BookComp © 2026</p>
      </div>
    </aside>
  );
}
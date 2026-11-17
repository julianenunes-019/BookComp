
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

import "./App.css";

const API = "http://localhost:3000";
const LIVROS_POR_PAGINA = 5;

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logado, setLogado] = useState(
    !!localStorage.getItem("token")
  );

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || null;
    } catch {
      return null;
    }
  });

  // ROTAS DO SISTEMA
  const caminhos = {
    busca: "/dashboard",
    emprestimos: "/livros",
    meusEmprestimos: "/emprestimos",
    perfil: "/perfil"
  };

  const paginas = {
    "/dashboard": "busca",
    "/livros": "emprestimos",
    "/emprestimos": "meusEmprestimos",
    "/perfil": "perfil"
  };

  const pagina = paginas[location.pathname] || "busca";

  const setPagina = (nome) => {
    navigate(caminhos[nome] || "/dashboard");
  };

  const [titulo, setTitulo] = useState("");
  const [tituloBiblioteca, setTituloBiblioteca] = useState("");

  const [livros, setLivros] = useState([]);
  const [biblioteca, setBiblioteca] = useState([]);
  const [meusEmprestimos, setMeusEmprestimos] = useState([]);

  const [quantidadesEmprestimo, setQuantidadesEmprestimo] = useState({});
  const [livroEditando, setLivroEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paginaBusca, setPaginaBusca] = useState(1);
  const [paginaBiblioteca, setPaginaBiblioteca] = useState(1);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const notificacaoTimer = useRef(null);
  const token = localStorage.getItem("token");

  // PAGINAÇÃO DA BUSCA
  const totalPaginasBusca = Math.ceil(
    livros.length / LIVROS_POR_PAGINA
  );

  const livrosPaginados = livros.slice(
    (paginaBusca - 1) * LIVROS_POR_PAGINA,
    paginaBusca * LIVROS_POR_PAGINA
  );

  // FILTRO E PAGINAÇÃO DA BIBLIOTECA
  const bibliotecaFiltrada = biblioteca.filter((livro) =>
    livro.titulo?.toLowerCase().includes(
      tituloBiblioteca.trim().toLowerCase()
    )
  );

  const totalPaginasBiblioteca = Math.ceil(
    bibliotecaFiltrada.length / LIVROS_POR_PAGINA
  );

  const bibliotecaPaginada = bibliotecaFiltrada.slice(
    (paginaBiblioteca - 1) * LIVROS_POR_PAGINA,
    paginaBiblioteca * LIVROS_POR_PAGINA
  );

  // NOTIFICAÇÕES
  const notificar = (texto, tipo = "sucesso") => {
    clearTimeout(notificacaoTimer.current);

    setMensagem(texto);
    setTipoMensagem(tipo);

    notificacaoTimer.current = setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  };

  // VERIFICAR E CARREGAR USUÁRIO LOGADO
  useEffect(() => {
    if (!logado || !token) {
      return;
    }

    const verificarUsuario = async () => {
      try {
        const resposta = await axios.get(
          `${API}/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUsuario(resposta.data);

        localStorage.setItem(
          "usuario",
          JSON.stringify(resposta.data)
        );
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");

          setUsuario(null);
          setLogado(false);
          navigate("/login", { replace: true });
        } else {
          notificar(
            "Não foi possível verificar sua sessão.",
            "erro"
          );
        }
      }
    };

    verificarUsuario();
  }, [logado, token]);

  // ABRIR PERFIL
  const abrirPerfil = () => {
    navigate("/perfil");
  };

  // ATUALIZAR DADOS DO USUÁRIO
  const atualizarUsuario = (usuarioAtualizado) => {
    setUsuario(usuarioAtualizado);

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioAtualizado)
    );
  };

  // SAIR DA CONTA
  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
    setLogado(false);

    setLivros([]);
    setBiblioteca([]);
    setMeusEmprestimos([]);

    setTitulo("");
    setTituloBiblioteca("");
    setLivroEditando(null);

    setMensagem("");
    setTipoMensagem("");

    clearTimeout(notificacaoTimer.current);

    navigate("/login", { replace: true });
  };

  // BUSCAR LIVROS NA OPEN LIBRARY
  const buscarLivros = async () => {
    if (!titulo.trim()) {
      notificar("Digite o título de um livro para buscar.", "erro");
      return;
    }

    try {
      setLoading(true);

      const resposta = await axios.get(
        `${API}/livros/buscar?titulo=${encodeURIComponent(titulo)}`
      );

      setLivros(resposta.data);
      setPaginaBusca(1);
      setMensagem("");
      setTipoMensagem("");
    } catch (err) {
      console.error(err);
      notificar("Não foi possível buscar os livros.", "erro");
    } finally {
      setLoading(false);
    }
  };

  // CARREGAR LIVROS CADASTRADOS
  const carregarBiblioteca = async () => {
    try {
      setLoading(true);

      const resposta = await axios.get(`${API}/livros`);

      setBiblioteca(resposta.data);
      setPaginaBiblioteca(1);
      navigate("/livros");
    } catch (err) {
      console.error(err);
      notificar("Não foi possível carregar os livros.", "erro");
    } finally {
      setLoading(false);
    }
  };

  // CADASTRAR LIVRO
  const adicionar = async (livro) => {
    try {
      setLoading(true);

      await axios.post(`${API}/livros/cadastrar`, {
        titulo: livro.titulo,
        autor: livro.autor || "Desconhecido",
        ano: livro.ano || 0,
        capa: livro.capa || "",
        status: "disponível",
        detalhes: livro.detalhes || null,
        quantidade_estoque: 10
      });

      notificar("Livro adicionado com sucesso!");
      await carregarBiblioteca();
    } catch (err) {
      console.error(err);
      notificar(
        err.response?.data?.erro ||
        "Não foi possível cadastrar o livro.",
        "erro"
      );
    } finally {
      setLoading(false);
    }
  };

  // EDITAR LIVRO
  const editar = (livro) => {
    setLivroEditando({ ...livro });
  };

  const salvarEdicao = async () => {
    const ano = Number(livroEditando.ano);

    if (
      !livroEditando.titulo.trim() ||
      !livroEditando.autor.trim() ||
      !livroEditando.capa.trim()
    ) {
      notificar("Preencha todos os dados do livro.", "erro");
      return;
    }

    if (!Number.isInteger(ano) || ano < 0) {
      notificar("Informe um ano válido.", "erro");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${API}/livros/editar/${livroEditando.id_Livros}`,
        {
          titulo: livroEditando.titulo,
          autor: livroEditando.autor,
          ano,
          capa: livroEditando.capa,
          quantidade_estoque: livroEditando.quantidade_estoque
        }
      );

      setLivroEditando(null);
      notificar("Livro atualizado com sucesso!");
      await carregarBiblioteca();
    } catch (err) {
      console.error(err);
      notificar(
        err.response?.data?.erro ||
        "Não foi possível atualizar o livro.",
        "erro"
      );
    } finally {
      setLoading(false);
    }
  };

  // EXCLUIR LIVRO
  const deletar = async (id) => {
    try {
      setLoading(true);

      await axios.delete(`${API}/livros/deletar/${id}`);

      notificar("Livro removido com sucesso!");
      await carregarBiblioteca();
    } catch (err) {
      console.error(err);
      notificar(
        err.response?.data?.erro ||
        "Não foi possível remover o livro.",
        "erro"
      );
    } finally {
      setLoading(false);
    }
  };

  // SOLICITAR EMPRÉSTIMO
  const solicitarEmprestimo = async (livro) => {
    try {
      const quantidade = Number(
        quantidadesEmprestimo[livro.id_Livros] || 1
      );

      if (
        !Number.isInteger(quantidade) ||
        quantidade < 1 ||
        quantidade > Number(livro.quantidade_estoque)
      ) {
        notificar(
          "Informe uma quantidade válida para o estoque disponível.",
          "erro"
        );
        return;
      }

      await axios.post(
        `${API}/emprestimos`,
        {
          livro_id: livro.id_Livros,
          quantidade
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuantidadesEmprestimo({});
      notificar("Empréstimo solicitado com sucesso!");
      await carregarBiblioteca();
    } catch (err) {
      console.error(err);
      notificar(
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        "Não foi possível solicitar o empréstimo.",
        "erro"
      );
    }
  };

  // CARREGAR EMPRÉSTIMOS DO USUÁRIO
  const carregarMeusEmprestimos = async () => {
    try {
      setLoading(true);

      const resposta = await axios.get(
        `${API}/emprestimos/meus`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMeusEmprestimos(resposta.data);
      navigate("/emprestimos");
    } catch (err) {
      console.error(err);
      notificar(
        "Não foi possível carregar seus empréstimos.",
        "erro"
      );
    } finally {
      setLoading(false);
    }
  };

  // CANCELAR EMPRÉSTIMO
  const cancelarEmprestimo = async (id) => {
    try {
      await axios.put(
        `${API}/emprestimos/cancelar/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      notificar("Empréstimo cancelado com sucesso!");
      await carregarMeusEmprestimos();
    } catch (err) {
      console.error(err);
      notificar(
        err.response?.data?.erro ||
        "Não foi possível cancelar o empréstimo.",
        "erro"
      );
    }
  };

  // PROTEÇÃO DAS ROTAS
  if (
    !logado &&
    !["/login", "/cadastro"].includes(location.pathname)
  ) {
    return <Navigate to="/login" replace />;
  }

  if (
    logado &&
    ["/", "/login", "/cadastro"].includes(location.pathname)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // LOGIN E CADASTRO
  if (!logado) {
    return location.pathname === "/cadastro" ? (
      <Cadastro
        irParaLogin={() => navigate("/login")}
      />
    ) : (
      <Login
        notificar={notificar}
        aoEntrar={() => {
          let usuarioSalvo = null;

          try {
            usuarioSalvo = JSON.parse(
              localStorage.getItem("usuario")
            );
          } catch {
            usuarioSalvo = null;
          }

          setUsuario(usuarioSalvo);
          setLogado(true);
          navigate("/dashboard");
        }}
        irParaCadastro={() => navigate("/cadastro")}
      />
    );
  }

  return (
    <div className="app">
      <Header
        pagina={pagina}
        setPagina={setPagina}
        abrirEmprestimos={carregarBiblioteca}
        carregarMeusEmprestimos={carregarMeusEmprestimos}
        abrirPerfil={abrirPerfil}
        sair={sair}
      />

      <div className="app-content">
        <main className="container">
          {mensagem && (
            <div className={`notificacao ${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          {loading && (
            <p className="loading-msg">Carregando...</p>
          )}

          {/* TELA INICIAL E BUSCA */}
          {pagina === "busca" && !loading && (
            <>
              <h2 className="saudacao">
                Bem-vindo, {usuario?.nome || "Usuário"}
              </h2>

              <SearchBar
                titulo={titulo}
                setTitulo={setTitulo}
                buscar={buscarLivros}
              />

              <section className="section">
                <h2>Livros encontrados ({livros.length})</h2>

                {livros.length === 0 ? (
                  <p className="empty">
                    Nenhum resultado encontrado. Faça uma busca!
                  </p>
                ) : (
                  <>
                    {totalPaginasBusca > 1 && (
                      <div className="paginacao-container">
                        <span className="paginacao-info">
                          Mostrando{" "}
                          {(paginaBusca - 1) * LIVROS_POR_PAGINA + 1}–
                          {Math.min(
                            paginaBusca * LIVROS_POR_PAGINA,
                            livros.length
                          )}
                          {" "}de {livros.length} livros
                        </span>

                        <div className="paginacao">
                          <button
                            disabled={paginaBusca === 1}
                            onClick={() => setPaginaBusca(paginaBusca - 1)}
                          >
                            Anterior
                          </button>

                          {Array.from(
                            { length: totalPaginasBusca },
                            (_, i) => i + 1
                          ).map((numero) => (
                            <button
                              key={numero}
                              className={
                                paginaBusca === numero
                                  ? "pagina-ativa"
                                  : "pagina-numero"
                              }
                              onClick={() => setPaginaBusca(numero)}
                            >
                              {numero}
                            </button>
                          ))}

                          <button
                            disabled={paginaBusca === totalPaginasBusca}
                            onClick={() => setPaginaBusca(paginaBusca + 1)}
                          >
                            Próxima
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid-busca">
                      {livrosPaginados.map((livro, index) => (
                        <BookCard
                          key={livro.detalhes || `${livro.titulo}-${index}`}
                          livro={livro}
                          onAdd={adicionar}
                          isLibrary={false}
                          cardClass="card-busca"
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
            </>
          )}

          {/* BIBLIOTECA */}
          {pagina === "emprestimos" && !loading && (
            <section className="section">
              <h2>Livros da biblioteca</h2>

              <div className="searchBox">
                <input
                  type="text"
                  value={tituloBiblioteca}
                  onChange={(e) => {
                    setTituloBiblioteca(e.target.value);
                    setPaginaBiblioteca(1);
                  }}
                  placeholder="Buscar livro no acervo..."
                  aria-label="Buscar livro cadastrado no acervo"
                />

                {tituloBiblioteca && (
                  <button
                    type="button"
                    onClick={() => {
                      setTituloBiblioteca("");
                      setPaginaBiblioteca(1);
                    }}
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* EDIÇÃO DE LIVRO */}
              {livroEditando && (
                <div className="form-edicao">
                  <h3>Editar livro</h3>

                  <label>Título:</label>
                  <input
                    value={livroEditando.titulo}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        titulo: e.target.value
                      })
                    }
                  />

                  <label>Autor:</label>
                  <input
                    value={livroEditando.autor}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        autor: e.target.value
                      })
                    }
                  />

                  <label>Ano:</label>
                  <input
                    type="number"
                    value={livroEditando.ano ?? ""}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        ano: e.target.value
                      })
                    }
                  />

                  <label>Link da capa:</label>
                  <input
                    value={livroEditando.capa}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        capa: e.target.value
                      })
                    }
                  />

                  <button className="add-btn" onClick={salvarEdicao}>
                    Salvar alterações
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => setLivroEditando(null)}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {biblioteca.length === 0 ? (
                <p className="empty">
                  Ainda não existem livros cadastrados.
                </p>
              ) : bibliotecaFiltrada.length === 0 ? (
                <p className="empty">
                  Nenhum livro encontrado.
                </p>
              ) : (
                <>
                  {totalPaginasBiblioteca > 1 && (
                    <div className="paginacao-container">
                      <span className="paginacao-info">
                        Mostrando{" "}
                        {(paginaBiblioteca - 1) * LIVROS_POR_PAGINA + 1}–
                        {Math.min(
                          paginaBiblioteca * LIVROS_POR_PAGINA,
                          bibliotecaFiltrada.length
                        )}
                        {" "}de {bibliotecaFiltrada.length} livros
                      </span>

                      <div className="paginacao">
                        <button
                          disabled={paginaBiblioteca === 1}
                          onClick={() =>
                            setPaginaBiblioteca(paginaBiblioteca - 1)
                          }
                        >
                          Anterior
                        </button>

                        {Array.from(
                          { length: totalPaginasBiblioteca },
                          (_, i) => i + 1
                        ).map((numero) => (
                          <button
                            key={numero}
                            className={
                              paginaBiblioteca === numero
                                ? "pagina-ativa"
                                : "pagina-numero"
                            }
                            onClick={() => setPaginaBiblioteca(numero)}
                          >
                            {numero}
                          </button>
                        ))}

                        <button
                          disabled={
                            paginaBiblioteca === totalPaginasBiblioteca
                          }
                          onClick={() =>
                            setPaginaBiblioteca(paginaBiblioteca + 1)
                          }
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid-biblioteca">
                    {bibliotecaPaginada.map((livro) => (
                      <BookCard
                        key={livro.id_Livros}
                        livro={livro}
                        onEdit={editar}
                        onDelete={deletar}
                        isLibrary={true}
                        cardClass="card-biblioteca"
                      >
                        {Number(livro.quantidade_estoque) > 0 ? (
                          <div className="area-emprestimo">
                            <label>Quantidade desejada:</label>

                            <input
                              type="number"
                              min="1"
                              max={livro.quantidade_estoque}
                              value={
                                quantidadesEmprestimo[livro.id_Livros] || 1
                              }
                              onChange={(e) =>
                                setQuantidadesEmprestimo({
                                  ...quantidadesEmprestimo,
                                  [livro.id_Livros]: e.target.value
                                })
                              }
                            />

                            <button
                              className="add-btn"
                              onClick={() => solicitarEmprestimo(livro)}
                            >
                              Solicitar empréstimo
                            </button>
                          </div>
                        ) : (
                          <p className="status-indisponivel">
                            Nenhum exemplar disponível no momento.
                          </p>
                        )}
                      </BookCard>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* MEUS EMPRÉSTIMOS */}
          {pagina === "meusEmprestimos" && !loading && (
            <section className="section">
              <h2>Meus Empréstimos</h2>

              {meusEmprestimos.length === 0 ? (
                <p className="empty">
                  Você ainda não realizou nenhum empréstimo.
                </p>
              ) : (
                <div className="grid-biblioteca">
                  {meusEmprestimos.map((emprestimo) => (
                    <div
                      className="card-biblioteca"
                      key={emprestimo.id}
                    >
                      {emprestimo.capa && (
                        <img
                          src={emprestimo.capa}
                          alt={emprestimo.titulo}
                          className="book-img"
                        />
                      )}

                      <h3 className="book-title">
                        {emprestimo.titulo}
                      </h3>

                      <p className="book-author">
                        {emprestimo.autor}
                      </p>

                      <p>Quantidade: {emprestimo.quantidade}</p>

                      <p>
                        Data:{" "}
                        {new Date(emprestimo.data_hora).toLocaleString("pt-BR")}
                      </p>

                      <p>Status: {emprestimo.status}</p>

                      {emprestimo.status === "Pendente" && (
                        <button
                          className="remove-btn"
                          onClick={() =>
                            cancelarEmprestimo(emprestimo.id)
                          }
                        >
                          Cancelar empréstimo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* MEU PERFIL */}
          {pagina === "perfil" && (
            <Perfil
              voltar={() => navigate("/dashboard")}
              atualizarUsuario={atualizarUsuario}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;

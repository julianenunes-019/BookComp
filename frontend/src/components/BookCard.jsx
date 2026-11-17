
import { useState } from "react";

export default function BookCard({
  livro,
  onAdd,
  onDelete,
  onEdit,
  isLibrary,
  cardClass,
  children
}) {
  const [imgOk, setImgOk] = useState(true);

  const estoque = Number(livro.quantidade_estoque ?? 0);

  const adicionarLivro = () => {
    onAdd(livro, 1);
  };

  return (
    <div className={cardClass || "book-card"}>
      {imgOk && livro.capa ? (
        <img
          src={livro.capa}
          alt={livro.titulo}
          className="book-img"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="book-img placeholder">
          <p>Imagem não disponível</p>
        </div>
      )}

      <h3 className="book-title">{livro.titulo}</h3>
      <p className="book-author">{livro.autor}</p>

      {isLibrary && (
        <>
          <p>Ano: {livro.ano || "Não informado"}</p>

          <span className={`estoque-info ${estoque > 0 ? "disponivel" : "indisponivel"}`}>
            {estoque > 0
              ? `${estoque} ${estoque === 1 ? "exemplar disponível" : "exemplares disponíveis"}`
              : "Indisponível"}
          </span>

          {children}

          <button
            className="add-btn"
            onClick={() => onEdit(livro)}
          >
            Editar
          </button>

          <button
            className="remove-btn"
            onClick={() => onDelete(livro.id_Livros)}
          >
            Remover
          </button>
        </>
      )}

      {!isLibrary && onAdd && (
        <button
          className="add-btn"
          onClick={adicionarLivro}
        >
          Adicionar à biblioteca
        </button>
      )}
    </div>
  );
}


import BookCard from "./BookCard";

export default function LibraryList({
  livros,
  onDelete,
  onStatus
}) {
  return (
    <div className="section">
      <div className="grid">
        {livros.length === 0 ? (
          <p className="empty">
            Nenhum livro salvo ainda.
          </p>
        ) : (
          livros.map((livro) => (
            <BookCard
              key={livro.id_Livros}
              livro={livro}
              isLibrary={true}
              onDelete={onDelete}
              onStatus={onStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

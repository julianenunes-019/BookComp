
export default function SearchBar({ titulo, setTitulo, buscar }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      buscar();
    }
  };

  return (
    <div className="searchBox">
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar livros..."
      />

      <button onClick={buscar}>
        Buscar
      </button>
    </div>
  );
}


USE biblioteca;

-- =====================================
-- 1. USUARIO DE TESTE
-- =====================================

INSERT INTO usuarios
(nome, email, senha, data_nascimento, sexo)
SELECT
    'Usuario Teste',
    'teste@bookcomp.com',
    '$2b$10$1yFNViUMtPk7SW2fzqmXvu23SB4lD3Hd191aGqG3TyyytL.PPztEi',
    '2000-01-01',
    'Não informado'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios
    WHERE email = 'teste@bookcomp.com'
);


-- =====================================
-- 2. LIVROS DE TESTE
-- =====================================

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'Dom Casmurro',
    'Machado de Assis',
    'Disponível',
    1899,
    'https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg',
    'Obra clássica da literatura brasileira.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'Dom Casmurro' AND autor = 'Machado de Assis'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'O Pequeno Príncipe',
    'Antoine de Saint-Exupéry',
    'Disponível',
    1943,
    'https://covers.openlibrary.org/b/isbn/9788574061976-L.jpg',
    'Uma história sobre amizade e descobertas.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'O Pequeno Príncipe' AND autor = 'Antoine de Saint-Exupéry'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    '1984',
    'George Orwell',
    'Disponível',
    1949,
    'https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg',
    'Romance sobre vigilância e controle social.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = '1984' AND autor = 'George Orwell'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'A Hora da Estrela',
    'Clarice Lispector',
    'Disponível',
    1977,
    'https://covers.openlibrary.org/b/isbn/9788532508126-L.jpg',
    'Romance da escritora Clarice Lispector.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'A Hora da Estrela' AND autor = 'Clarice Lispector'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'Capitães da Areia',
    'Jorge Amado',
    'Disponível',
    1937,
    'https://covers.openlibrary.org/b/isbn/9788535911695-L.jpg',
    'Romance sobre crianças em situação de rua.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'Capitães da Areia' AND autor = 'Jorge Amado'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'Harry Potter e a Pedra Filosofal',
    'J. K. Rowling',
    'Disponível',
    1997,
    'https://covers.openlibrary.org/b/isbn/9788532530783-L.jpg',
    'Primeiro livro da série Harry Potter.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'Harry Potter e a Pedra Filosofal' AND autor = 'J. K. Rowling'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'O Hobbit',
    'J. R. R. Tolkien',
    'Disponível',
    1937,
    'https://covers.openlibrary.org/b/isbn/9788595084742-L.jpg',
    'Aventura fantástica pela Terra-média.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'O Hobbit' AND autor = 'J. R. R. Tolkien'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'Extraordinário',
    'R. J. Palacio',
    'Disponível',
    2012,
    'https://covers.openlibrary.org/b/isbn/9788580573015-L.jpg',
    'História sobre respeito e inclusão.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'Extraordinário' AND autor = 'R. J. Palacio'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'A Culpa é das Estrelas',
    'John Green',
    'Disponível',
    2012,
    'https://covers.openlibrary.org/b/isbn/9788580572261-L.jpg',
    'Romance sobre amor e superação.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'A Culpa é das Estrelas' AND autor = 'John Green'
);

INSERT INTO livros
(titulo, autor, status, ano, capa, detalhes, quantidade_estoque)
SELECT
    'Memórias Póstumas de Brás Cubas',
    'Machado de Assis',
    'Disponível',
    1881,
    'https://covers.openlibrary.org/b/isbn/9788525406561-L.jpg',
    'Uma das principais obras de Machado de Assis.',
    5
WHERE NOT EXISTS (
    SELECT 1 FROM livros
    WHERE titulo = 'Memórias Póstumas de Brás Cubas'
    AND autor = 'Machado de Assis'
);

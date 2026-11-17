# BookComp — Sistema de Gerenciamento de Biblioteca

## 1. Sobre o projeto

O **BookComp** é um sistema web desenvolvido para auxiliar no gerenciamento de uma biblioteca, permitindo o cadastro e gerenciamento de livros, controle de estoque, cadastro e autenticação de usuários e gerenciamento de empréstimos.

O sistema foi desenvolvido como projeto acadêmico do curso Técnico em Desenvolvimento de Sistemas do SENAI.

## 2. Tecnologias utilizadas

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- MySQL
- MySQL2
- BcryptJS
- JSON Web Token (JWT)

## 3. Funcionalidades

- Cadastro de usuários.
- Login e autenticação.
- Proteção de páginas para usuários autenticados.
- Visualização e edição do perfil.
- Cadastro, consulta, edição e exclusão de livros.
- Busca de livros.
- Paginação de livros.
- Controle de quantidade em estoque.
- Registro de empréstimos.
- Consulta dos empréstimos do usuário.
- Cancelamento de empréstimos pendentes.
- Atualização automática do estoque após o cancelamento.

## 4. Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- MySQL instalado.
- MySQL Workbench (recomendado).
- Editor de código, como Visual Studio Code.

### 4.1. Configuração do banco de dados

1. Abra o MySQL Workbench.
2. Crie ou selecione o banco de dados `biblioteca`.
3. Execute o script SQL de criação das tabelas, disponível no projeto.
4. Execute o arquivo `backend/db/seed.sql` para inserir os dados iniciais de teste.

A modelagem do banco está disponível nos arquivos `modelagem_bookcomp.mwb` e `modelagem_bookcomp.png`.

### 4.2. Configuração do backend

Abra o terminal na pasta `backend` e execute:

```bash
npm install
```

Configure o arquivo `.env` com os dados de conexão do MySQL e a chave JWT, conforme as variáveis utilizadas no projeto.

Depois, inicie o servidor:

```bash
node server.js
```

O backend utiliza a porta 3000.

### 4.3. Configuração do frontend

Abra outro terminal na pasta `frontend` e execute:

```bash
npm install
```

Depois, inicie a aplicação:

```bash
npm run dev
```

O Vite disponibilizará o endereço local para acessar o sistema, normalmente `http://localhost:5173`.

## 5. Usuário de teste

**E-mail:** teste@bookcomp.com

**Senha:** BookComp@123

## 6. Banco de dados

O sistema utiliza o banco de dados MySQL, composto por três tabelas principais:

- `usuarios`: armazena os dados dos usuários.
- `livros`: armazena as informações dos livros e o estoque.
- `emprestimos`: registra os empréstimos realizados.

As tabelas possuem chaves primárias e estrangeiras para estabelecer os relacionamentos entre os dados.

## 7. Equipe de desenvolvimento

- Juliane Nunes
- Emilly Figueiredo

As duas integrantes participaram conjuntamente do desenvolvimento do frontend e do backend, colaborando na implementação das funcionalidades, integração com o banco de dados e ajustes do sistema.

## 8. Projeto acadêmico

Curso Técnico em Desenvolvimento de Sistemas — SENAI Bahia, Alagoinhas.
# CV API - API de Currículos com Node.js e PostgreSQL

Esta é uma API RESTful construída com Node.js, Express e PostgreSQL, projetada para gerenciar as informações de um currículo.

A API permite operações CRUD (Criar, Ler, Atualizar, Deletar) completas para Pessoas, suas Experiências Profissionais e sua Formação Educacional, utilizando um banco de dados relacional.

O banco de dados está hospedado no Render e a API está publicada na Vercel.

# 🚀 API no Ar (Deploy na Vercel)

A API está publicada e pode ser acessada publicamente através do seguinte link:
https://cv-andreza-api.vercel.app

Você pode testar a rota principal no navegador:
https://cv-andreza-api.vercel.app/people

# 🛠️ Tecnologias Utilizadas

Node.js: Ambiente de execução do JavaScript no servidor.

Express: Framework para criação das rotas da API.

PostgreSQL: Banco de dados relacional.

Render: Hospedagem para o banco de dados PostgreSQL.

Vercel: Plataforma de deploy para a API (serverless).

node-postgres (pg): Driver para conectar o Node.js ao PostgreSQL.

dotenv: Para gerenciar variáveis de ambiente.

cors: Para permitir acesso à API de diferentes origens.

# 🗂️ Estrutura do Banco de Dados

O banco de dados é relacional e possui 3 tabelas principais:

person (Pessoa)

id (SERIAL, PK): Identificador único.

name (VARCHAR): Nome da pessoa.

title (VARCHAR): Título/Cargo (ex: "Desenvolvedora Web").

summary (TEXT): Um breve resumo sobre a pessoa.

experience (Experiência)

id (SERIAL, PK): Identificador único.

title (VARCHAR): Cargo da experiência.

company (VARCHAR): Nome da empresa.

dates (VARCHAR): Período (ex: "2023 - Presente").

description (TEXT): Descrição das atividades.

person_id (INTEGER, FK): Chave estrangeira que referencia person(id).

education (Educação)

id (SERIAL, PK): Identificador único.

degree (VARCHAR): Nome do curso/diploma.

school (VARCHAR): Nome da instituição.

dates (VARCHAR): Período (ex: "2022 - 2025").

person_id (INTEGER, FK): Chave estrangeira que referencia person(id).

# 📖 Endpoints da API

Abaixo estão todos os endpoints disponíveis na API.

(Utilize a coleção Postman CV-API-Completa.postman_collection.json inclusa no projeto para testar facilmente).

1. Pessoa (Person)

GET /people

Lista todas as pessoas cadastradas.

GET /people/:id

Busca uma pessoa específica pelo seu id.

POST /people

Cria uma nova pessoa.

Body (JSON): { "name": "...", "title": "...", "summary": "..." }

PUT /people/:id

Atualiza uma pessoa específica pelo seu id.

Body (JSON): { "name": "...", "title": "...", "summary": "..." }

DELETE /people/:id

Deleta uma pessoa específica pelo seu id. (Isso também deletará suas experiências e educações associadas, via ON DELETE CASCADE).

2. Experiência (Experience) - Relacionamento

GET /people/:id/experience

Lista todas as experiências de UMA pessoa específica (pelo id da pessoa).

POST /people/:id/experience

Adiciona uma nova experiência para UMA pessoa específica.

Body (JSON): { "title": "...", "company": "...", "dates": "...", "description": "..." }

PUT /experience/:exp_id

Atualiza UMA experiência específica (pelo exp_id da experiência).

Body (JSON): { "title": "...", "company": "...", "dates": "...", "description": "..." }

DELETE /experience/:exp_id

Deleta UMA experiência específica (pelo exp_id da experiência).

3. Educação (Education) - Relacionamento

GET /people/:id/education

Lista toda a formação educacional de UMA pessoa específica (pelo id da pessoa).

POST /people/:id/education

Adiciona uma nova formação para UMA pessoa específica.

Body (JSON): { "degree": "...", "school": "...", "dates": "..." }

PUT /education/:edu_id

Atualiza UMA formação específica (pelo edu_id da formação).

Body (JSON): { "degree": "...", "school": "...", "dates": "..." }

DELETE /education/:edu_id

Deleta UMA formação específica (pelo edu_id da formação).

# 💻 Como Rodar Localmente (Desenvolvimento)

Clone o repositório:

git clone [https://github.com/AndrezaCarrilho/cv_Andreza-API.git](https://github.com/AndrezaCarrilho/cv_Andreza-API.git)
cd cv_Andreza-API


Instale as dependências:

npm install


Crie o arquivo .env:

Crie um arquivo chamado .env na raiz do projeto.

Adicione a sua DATABASE_URL (a URL externa do seu banco de dados do Render) dentro dele:

DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE


Rode o servidor de desenvolvimento:

npm run dev


O servidor local estará rodando em http://localhost:4000.

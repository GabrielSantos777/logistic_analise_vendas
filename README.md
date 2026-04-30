# Painel de Analise de Vendas

Dashboard full-stack para analise de vendas, com **React** no frontend e **FastAPI + pandas** no backend.
O projeto transforma um CSV historico em um painel interativo com filtros e graficos.

## Sumario

- [Visao geral](#visao-geral)
- [Tecnologias](#tecnologias)
- [Estrutura](#estrutura)
- [Como executar](#como-executar)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [API](#api)
- [Boas praticas aplicadas](#boas-praticas-aplicadas)
- [Proximos passos](#proximos-passos)

## Visao geral

O painel responde perguntas de negocio como:

- Qual foi a receita total no periodo selecionado?
- Quais categorias, produtos e clientes mais geraram receita?
- Como a receita evoluiu ao longo do tempo?
- Quais paises tiveram maior desempenho?

Todos os widgets respondem aos mesmos filtros de periodo, categoria e pais.

## Tecnologias

- Frontend: React 19 + Vite
- Graficos: Recharts
- Cliente HTTP: Axios
- Backend: FastAPI
- Processamento de dados: pandas
- Infra local: Docker + Docker Compose

## Estrutura

```text
logistic_analise_vendas/
|-- backend/
|   |-- app/
|   |   |-- data_service.py
|   |   `-- main.py
|   |-- data/
|   |   `-- sales_data_sample.csv
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- App.jsx
|   |-- Dockerfile
|   `-- package.json
|-- notebooks/
|   `-- explore.ipynb
|-- docker-compose.yml
`-- README.md
```

## Como executar

### Com Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend (Swagger): `http://localhost:8000/docs`

### Sem Docker

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend (novo terminal):

```bash
cd frontend
npm install
npm run dev
```

## Variaveis de ambiente

Backend (`backend/.env`):

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000
```

## API

Endpoints principais:

- `GET /api`
- `GET /api/filter-options`
- `GET /api/kpis`
- `GET /api/revenue-by-month`
- `GET /api/top-products`
- `GET /api/revenue-by-category`
- `GET /api/top-customers`
- `GET /api/sales-by-country`

Filtros aceitos pelos endpoints analiticos:

- `start_date` (`YYYY-MM-DD`)
- `end_date` (`YYYY-MM-DD`)
- `category`
- `country`

## Boas praticas aplicadas

- Separacao de responsabilidades no backend:
  - `main.py` apenas com rotas e dependencia comum.
  - `data_service.py` concentrando transformacoes e regras de negocio.
- Cache de leitura do dataset com `lru_cache` para reduzir custo de I/O.
- Camada unica de acesso HTTP no frontend em `src/services/api.js`.
- Tokens de design CSS em `src/index.css` para manter consistencia visual.
- Layout responsivo com ajustes para desktop e mobile.
- Tratamento de erro na UI com alerta amigavel ao usuario.

## Proximos passos

- Adicionar testes unitarios para `backend/app/data_service.py`
- Adicionar testes de interface para fluxos de filtro no frontend
- Evoluir de CSV estatico para banco relacional (ex.: PostgreSQL)
- Incluir pipeline de CI para lint e build automatizados

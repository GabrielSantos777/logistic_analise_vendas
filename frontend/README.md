# Frontend do Painel de Vendas

Aplicacao React (Vite) responsavel pela interface do projeto.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build de producao
- `npm run preview`: sobe o build localmente para validacao
- `npm run lint`: executa o ESLint

## Configuracao

Use o arquivo `.env.example` como base:

```env
VITE_API_URL=http://localhost:8000
```

## Estrutura principal

- `src/App.jsx`: composicao do dashboard e orquestracao das chamadas
- `src/components/`: componentes visuais e graficos
- `src/services/api.js`: camada de acesso HTTP ao backend
- `src/utils/formatters.js`: formatadores de valores exibidos na UI

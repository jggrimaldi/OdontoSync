# Regras Gerais do Copilot para este Projeto

## Sugestões de Commit
* Sempre use o padrão **Conventional Commits** (ex: `feat:`, `fix:`, `chore:`, `refactor:`).
* Escreva as mensagens de commit em inglês simples.
* Mantenha o título do commit curto (máximo 50 caracteres) e adicione uma descrição mais detalhada se houver mudanças complexas.

## Boas Práticas em React
* Sempre crie **Functional Components** usando Arrow Functions. NUNCA use Class Components.
* Utilize TypeScript para tipar todas as `props` dos componentes. Não use `PropTypes`.
* Para gerenciamento de estado local, use sempre a API de Hooks (`useState`, `useReducer`).
* Separe a lógica de negócio da interface criando Custom Hooks sempre que um componente passar de 100 linhas.
* Use `Tailwind CSS` para estilização (não sugira CSS puro ou Styled Components neste projeto).
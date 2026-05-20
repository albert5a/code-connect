# AGENT.md

## Regras Fundamentais do Projeto

1. **Monorepo com pnpm workspaces**
   - Todos os apps e pacotes devem estar sob o controle do workspace pnpm.
   - Não criar repositórios git internos em apps/pacotes; o controle de versão é sempre na raiz.

2. **Apps em TypeScript**
   - Todo código de produção deve ser escrito em TypeScript.
   - Configurações de TypeScript (`tsconfig.json`) devem ser mantidas e revisadas em cada app.

3. **.gitignore**
   - Cada app deve ter seu próprio `.gitignore` adequado ao stack utilizado.
   - A raiz do projeto deve ter um `.gitignore` cobrindo node_modules, dist, lockfiles, IDEs, etc.

4. **Scripts e Atalhos**
   - Scripts globais no `package.json` da raiz para rodar, buildar e instalar cada app sem precisar trocar de diretório.
   - Sempre preferir rodar comandos via scripts do monorepo.

5. **Padronização de Estrutura**
   - Apps ficam em `apps/`.
   - Pacotes compartilhados (caso existam) ficam em `packages/`.

6. **Sem Dependências Duplicadas**
   - Sempre que possível, dependências compartilhadas devem ser instaladas na raiz ou promovidas para evitar duplicidade.

7. **Commits e Branches**
   - Commits devem ser claros e descritivos.
   - Branches devem seguir convenção: `feat/`, `fix/`, `chore/`, etc.

8. **Documentação**
   - Manter o `README.md` atualizado com instruções de uso, scripts e estrutura.
   - Atualizar este `AGENT.md` sempre que uma nova regra fundamental for definida.

9. **Sem arquivos sensíveis**
   - Nunca versionar `.env`, segredos, ou arquivos sensíveis.

10. **CI/CD e Testes**
    - Sempre que possível, configurar pipelines para lint, build e testes automatizados.

11. **Frontend: Atomic Design, Tailwind e Testes de Componentes**
    - A arquitetura de componentes deve seguir o padrão Atomic Design (atoms, molecules, organisms, templates, pages).
    - Todo componente deve ser criado em sua respectiva pasta conforme o nível atômico.
    - O uso de Tailwind CSS é obrigatório para estilização.
    - Todo componente deve possuir pelo menos um teste cobrindo seu uso essencial (renderização, props principais, interação básica).

12. **Backend: Princípios REST**
    - Todas as APIs devem ser aderentes aos princípios REST:
      - Recursos bem definidos e nomeados no plural.
      - Uso correto dos métodos HTTP (GET, POST, PUT, DELETE, PATCH).
      - Status codes apropriados para cada resposta.
      - Statelessness: cada requisição deve conter todas as informações necessárias.
      - HATEOAS quando aplicável.
    - Documentação das rotas e contratos é obrigatória.

13. **Git: Conventional Commits**
    - Todos os commits devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):
      - Exemplo: `feat: criar componente Button atomico`
      - Exemplo: `fix(api): corrigir status code de erro`
    - Commits fora do padrão não serão aceitos na main.

---

> Este arquivo deve ser lido e seguido por todos os agentes e desenvolvedores do projeto. Atualize conforme novas necessidades surgirem.

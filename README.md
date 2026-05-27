# Code Connect Workspace

> **Blog pessoal AI Native**
>
> Este projeto é um monorepo para um blog pessoal, construído desde o início com princípios AI Native: automação, integração contínua, componentes inteligentes e foco em produtividade assistida por IA.

## Visão Geral

- **Frontend:** React + Vite + TypeScript, arquitetura Atomic Design, estilização com Tailwind CSS, todos os componentes com testes essenciais.
- **Backend:** Nest.js + TypeScript, APIs 100% aderentes aos princípios REST.
- **Monorepo:** Gerenciado com pnpm workspaces, sem repositórios internos nos apps.
- **Commits:** Uso obrigatório de [Conventional Commits](https://www.conventionalcommits.org/).
- **Automação:** Scripts globais para build, dev, lint e instalação.

## Estrutura

```
code-connect/
├── apps/
│   ├── web/       # App React com Vite
│   └── api/       # App Nest.js
├── package.json   # Root package.json com atalhos
├── pnpm-workspace.yaml
└── README.md
```

## Scripts Disponíveis

### App Web (React + Vite)

```bash
# Iniciar desenvolvimento
pnpm web:dev

# Build para produção
pnpm web:build

# Preview do build
pnpm web:preview

# Instalar dependências
pnpm web:install
```

### App API (Nest.js)

```bash
# Iniciar em desenvolvimento (com hot reload)
pnpm api:start:dev

# Build para produção
pnpm api:build

# Iniciar em produção
pnpm api:start:prod

# Debug
pnpm api:start:debug

# Instalar dependências
pnpm api:install
```

### Comandos Globais

```bash
# Instalar todas as dependências do workspace
pnpm install

# Executar dev em ambos os apps em paralelo
pnpm dev

# Build de todos os packages
pnpm build

# Executar lint em todos os packages
pnpm lint
```

## Instalação e Uso

1. **Instalar dependências:**

   ```bash
   pnpm install
   ```

2. **Executar desenvolvimento (ambos os apps):**

   ```bash
   pnpm dev
   ```

   Ou executar apenas um app:

   ```bash
   pnpm web:dev
   pnpm api:start:dev
   ```

3. **Build:**
   ```bash
   pnpm build
   ```

## Sobre pnpm Workspaces

O pnpm workspaces permite que você gerencie múltiplos pacotes em um único repositório, com dependency sharing eficiente. O arquivo `pnpm-workspace.yaml` define quais diretórios são considerados packages.

Para mais informações sobre pnpm, visite: [https://pnpm.io](https://pnpm.io)

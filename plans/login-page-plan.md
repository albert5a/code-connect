## Plan: Implementar página de login no frontend

TL;DR: criar a página de login em `apps/web` usando Atomic Design com Tailwind CSS, definindo uma base de layout reutilizável para o cadastro futuro.

**Steps**
1. Configurar Tailwind CSS em `apps/web`.
   - adicionar dependências de Tailwind e PostCSS na pasta `apps/web`.
   - criar `tailwind.config.js` e `postcss.config.js`.
   - ajustar `apps/web/src/index.css` para importar os utilitários do Tailwind.

2. Estruturar componentes Atomic Design.
   - criar pastas `apps/web/src/components/atoms`, `.../molecules`, `.../organisms`, `.../pages`.
   - atoms principais: `Button`, `Input`, `Checkbox`, `Label`, `Text`, `Link`, `SocialIcon`.
   - molecules: `FormField`, `CheckboxField`, `SocialLoginButtons`, `DividerText`.
   - organisms: `AuthBanner`, `AuthForm`, `AuthLayout`.

3. Implementar o layout de login com foco em reuso.
   - `AuthLayout` deve aceitar props de título, subtítulo, imagem do banner, conteúdo do formulário e links secundários.
   - `AuthForm` deve ser configurável para exibir campos de login hoje e aceitar um shape de campos diferente no futuro para cadastro.
   - usar `public/github.png`, `public/google.png` e `public/banner-login.png`.

4. Criar a página `LoginPage`.
   - montar `AuthLayout` com o banner e o formulário de login específicos.
   - renderizar na raiz do app via `apps/web/src/App.tsx`.

5. Aplicar UI e responsividade.
   - seguir visual escuro/Stylized do mockup.
   - garantir que o layout do cartão central funcione em mobile.
   - deixar a estrutura preparada para trocar o banner e os campos para a página de cadastro.

6. Verificação e ajustes.
   - rodar `pnpm -C apps/web install` e `pnpm -C apps/web dev`.
   - verificar a página localmente.
   - confirmar carregamento dos assets e responsividade.

**Relevant files**
- `apps/web/package.json` — instalar dependências Tailwind.
- `apps/web/vite.config.ts` ou `apps/web/vite.config.js` — verificar se precisa ajuste de PostCSS/Tailwind.
- `apps/web/src/index.css` — pontos de import para Tailwind.
- `apps/web/src/App.tsx` — renderizar a página de login.
- `apps/web/src/components/atoms/*` — novos componentes atômicos.
- `apps/web/src/components/molecules/*` — novos componentes compostos.
- `apps/web/src/components/organisms/*` — novo layout de autenticação.
- `apps/web/src/pages/LoginPage.tsx` — página de login.
- `apps/web/src/main.tsx` — entrada do app, se precisar manter.

**Verification**
1. confirmar que `apps/web` abre e exibe o login.
2. verificar uso de `banner-login.png`, `github.png`, `google.png`.
3. inspecionar composição de `AuthLayout` para reuse em cadastro.
4. rodar lint no frontend se possível.

**Decisions**
- usar Tailwind no frontend por pedido e por regra do projeto.
- implementar apenas a página de login agora, mas projetar `AuthLayout` e `AuthForm` para futura página de cadastro.
- manter o app como SPA simples sem roteamento adicional neste momento.

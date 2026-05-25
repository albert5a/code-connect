# Plano: Página de Cadastro (Register)

Objetivo: implementar a página de cadastro seguindo o layout do Figma e reaproveitando os componentes já existentes (`AuthLayout`, `AuthBanner`, `FormField`, `Input`, `Button`, `CheckboxField`, `SocialLoginButtons`). Fazer pequenos ajustes de estilo onde necessário para alinhar visualmente com o Figma.

Figma (referência): https://www.figma.com/design/xJKsT3NVofafMSK68rUSx5/CodeConnect---Acervo---Fa%C3%A7a-uma-c%C3%B3pia---Community-?node-id=155-3469&t=lgTUgStASbVakEdY-0

Etapas:

1. Criar a página `apps/web/src/pages/RegisterPage.tsx` usando `AuthLayout` — rota: `/register`.
2. Implementar o formulário de registro: `apps/web/src/components/organisms/RegisterForm.tsx` ou estender `AuthForm` para suportar `mode: 'register'`.
   - Campos: `Nome completo`, `E-mail`, `Senha`, `Confirmar senha`.
   - Checkbox para aceitar termos/políticas.
   - Botões de social login (reusar `SocialLoginButtons`).
3. Adicionar validação cliente básica:
   - Nome obrigatório, e-mail válido, senha mínima (8), confirmação de senha igual, aceitar termos.
4. Ligar o submit a um endpoint de signup (mock inicialmente se endpoint não existir em `apps/api`). Encapsular chamada em `apps/web/src/services/auth.ts` se necessário.
5. Atualizar `LoginPage` para navegar para `/register` (link já atualizado) e garantir link de volta em `RegisterPage` para `/login`.
6. Ajuste fino de estilos para casar com o Figma: tipografia, espaçamento, placeholders, textos do botão, imagem do banner.
7. Testes manuais: rodar `apps/web` em dev, checar `/register` responsivo e comparar com o Figma.

Verificação / comandos para testar localmente:

```bash
cd apps/web
pnpm install
pnpm dev
# abrir http://localhost:5173/register (ou porta mostrada)
```

Decisões e suposições:

- Rota escolhida: `/register` (consistente com `/login`).
- Preferir reaproveitar componentes existentes em vez de duplicar lógica.
- Se não houver API de signup, criaremos um mock local e deixaremos `TODO` para integração.

Próximos passos (após aprovação deste plano):

- Implementar `RegisterForm` e `RegisterPage` (criação de arquivos).
- Adicionar validação e mock de submit.
- Ajustar estilos conforme comparativo com Figma.

Autor: implementado pelo time (automação) — peça revisão visual depois de rodar o dev server.

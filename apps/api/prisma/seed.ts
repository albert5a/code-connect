import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

config({ path: '../../.env' });
config({ path: '.env', override: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não configurada');
}

const pool = new Pool({ connectionString });

const posts = [
  {
    title: 'React Server Components na prática',
    excerpt:
      'Um guia para entender onde os Server Components reduzem JavaScript no cliente e onde ainda vale manter interatividade local.',
    content:
      'React Server Components ajudam a mover trabalho para o servidor sem abandonar a composição que tornou React produtivo. Neste post, exploramos quando buscar dados no servidor, como separar componentes interativos e quais cuidados tomar com estado, cache e boundaries de carregamento.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1000&q=80',
    tags: ['React', 'Server Components', 'Frontend'],
  },
  {
    title: 'Hooks customizados para formulários previsíveis',
    excerpt:
      'Como organizar validação, estado de envio e feedback de erro sem espalhar regras por vários componentes.',
    content:
      'Hooks customizados continuam sendo uma boa forma de encapsular comportamento em aplicações React. Para formulários, eles permitem concentrar regras de validação, estado de loading, erros da API e normalização dos dados antes do envio.',
    thumbnailUrl: null,
    tags: ['React', 'Hooks', 'UX'],
  },
  {
    title: 'NodeJS com filas para tarefas pesadas',
    excerpt:
      'Separar tarefas demoradas do request melhora tempo de resposta e deixa a API mais resiliente.',
    content:
      'Em APIs NodeJS, nem todo processamento precisa acontecer durante a requisição HTTP. Filas ajudam a lidar com envio de emails, geração de relatórios, integrações externas e retentativas controladas sem bloquear a experiência principal do usuário.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    tags: ['NodeJS', 'Filas', 'Backend'],
  },
  {
    title: 'Camadas de serviço em APIs NestJS',
    excerpt:
      'Controllers pequenos, services coesos e DTOs bem definidos deixam features novas mais fáceis de testar.',
    content:
      'NestJS incentiva uma arquitetura em camadas que combina bem com times crescendo. Controllers cuidam da superfície HTTP, services concentram regras de negócio e DTOs validam a entrada antes que ela chegue no domínio.',
    thumbnailUrl: null,
    tags: ['NodeJS', 'NestJS', 'Arquitetura'],
  },
  {
    title: 'Busca full text no Postgres para feeds técnicos',
    excerpt:
      'Uma busca simples no banco pode entregar relevância suficiente antes de trazer motores externos.',
    content:
      'Postgres oferece recursos nativos de full text search com tsvector, tsquery e índices GIN. Para um feed de posts técnicos, isso permite buscar por título, resumo, conteúdo e tags com boa performance e sem adicionar infraestrutura cedo demais.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
    tags: ['NodeJS', 'Postgres', 'Busca'],
  },
  {
    title: 'Renderização condicional sem esconder estado importante',
    excerpt:
      'Estados de vazio, erro e carregamento fazem parte da interface e precisam do mesmo cuidado do caminho feliz.',
    content:
      'No React, renderização condicional aparece em quase toda tela. O desafio é tratar loading, erro, vazio e sucesso como estados oficiais da experiência, mantendo mensagens úteis e evitando mudanças bruscas de layout.',
    thumbnailUrl: null,
    tags: ['React', 'Estado', 'Interface'],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('codeconnect123', 10);

  const authorResult = await pool.query<{ id: string }>(
    `
      INSERT INTO "users" ("id", "name", "email", "password_hash", "updated_at")
      VALUES ($1, $2, $3, $4, now())
      ON CONFLICT ("email") DO UPDATE SET
        "name" = EXCLUDED."name",
        "updated_at" = now()
      RETURNING "id"
    `,
    [
      randomUUID(),
      'Equipe CodeConnect',
      'seed@codeconnect.dev',
      passwordHash,
    ],
  );
  const author = authorResult.rows[0];

  for (const post of posts) {
    const existingPost = await pool.query<{ id: string }>(
      'SELECT "id" FROM "posts" WHERE "title" = $1 LIMIT 1',
      [post.title],
    );

    if (existingPost.rowCount) {
      await pool.query(
        `
          UPDATE "posts"
          SET
            "excerpt" = $1,
            "content" = $2,
            "thumbnail_url" = $3,
            "tags" = $4,
            "author_id" = $5,
            "updated_at" = now()
          WHERE "id" = $6
        `,
        [
          post.excerpt,
          post.content,
          post.thumbnailUrl,
          post.tags,
          author.id,
          existingPost.rows[0].id,
        ],
      );
      continue;
    }

    await pool.query(
      `
        INSERT INTO "posts" (
          "id",
          "title",
          "excerpt",
          "content",
          "thumbnail_url",
          "tags",
          "author_id",
          "updated_at"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, now())
      `,
      [
        randomUUID(),
        post.title,
        post.excerpt,
        post.content,
        post.thumbnailUrl,
        post.tags,
        author.id,
      ],
    );
  }
}

main()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });

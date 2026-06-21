import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Workaround para issue do @nestjs/swagger@6.3.0
  // Servir Swagger com documento manual devido a incompatibilidade com scanning de rotas
  const swaggerDoc: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticação',
      description:
        'Endpoints de cadastro, login e perfil do usuário autenticado',
      version: '1.0',
    },
    servers: [{ url: '/', description: 'Local server' }],
    paths: {
      '/': {
        get: {
          summary: 'Health check',
          tags: ['app'],
          responses: {
            '200': { description: 'API está rodando' },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Registrar novo usuário',
          tags: ['auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'João Silva' },
                    email: { type: 'string', example: 'joao@exemplo.com' },
                    password: {
                      type: 'string',
                      example: 'senhaSegura123',
                      minLength: 6,
                    },
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            '201': { description: 'Usuário registrado com sucesso' },
            '400': { description: 'Dados inválidos' },
            '409': { description: 'Email já cadastrado' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Fazer login',
          tags: ['auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'joao@exemplo.com' },
                    password: { type: 'string', example: 'senhaSegura123' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login bem-sucedido',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Credenciais inválidas' },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Obter dados do usuário autenticado',
          tags: ['auth'],
          security: [{ bearer: [] }],
          responses: {
            '200': {
              description: 'Dados do usuário',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Não autenticado' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido ao fazer login',
        },
      },
    },
  };

  try {
    SwaggerModule.setup('docs', app, swaggerDoc);
    console.log('✓ Swagger inicializado em http://localhost:3000/docs');
  } catch (error) {
    console.warn(
      '⚠ Não foi possível inicializar Swagger, a API continuará funcionando',
      error,
    );
  }

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`✓ API rodando em http://localhost:${PORT}`);
}
void bootstrap();

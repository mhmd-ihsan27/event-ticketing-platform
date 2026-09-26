import { Options } from 'swagger-jsdoc';

/**
 * Swagger / OpenAPI 3.0 Configuration
 *
 * Defines the base API info and tells swagger-jsdoc where
 * to look for JSDoc @swagger annotations in the source files.
 */
export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Manajemen Event & Tiket Digital API',
      version: '1.0.0',
      description:
        'REST API untuk platform manajemen event dan tiket digital. ' +
        'Mencakup autentikasi, manajemen user, event, dan tiket.',
      contact: {
        name: 'API Support',
        email: 'support@eventtiket.id',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}/api/v1',
        description: 'Development Server',
        variables: {
          port: {
            default: process.env.PORT || '3000',
            description: 'Server port from .env',
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT access token. Format: Bearer <token>',
        },
      },
      schemas: {
        // ─── Common Response Shapes ─────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operasi berhasil.' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Terjadi kesalahan.' },
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Email sudah terdaftar.'],
            },
          },
        },

        // ─── Auth Schemas ────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Budi Santoso',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'budi@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'P@ssw0rd!',
              description: 'Min 8 karakter, harus mengandung huruf besar, kecil, angka, dan simbol.',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'budi@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'P@ssw0rd!',
            },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token (expires in 15m)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token (expires in 7d)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            expiresIn: {
              type: 'string',
              example: '15m',
            },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-...' },
            name: { type: 'string', example: 'Budi Santoso' },
            email: { type: 'string', format: 'email', example: 'budi@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isActive: { type: 'boolean', example: true },
            emailVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    // Apply BearerAuth globally — individual routes can override
    security: [{ BearerAuth: [] }],
  },

  // Where to find JSDoc @swagger annotations
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.controller.ts',
  ],
};

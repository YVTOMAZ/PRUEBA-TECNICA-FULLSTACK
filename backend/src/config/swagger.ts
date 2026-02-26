import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypto App API',
      version: '1.0.0',
      description: 'REST API for Crypto App — Fullstack Technical Test',
    },
    servers: [
      { url: '/api', description: 'API Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Crypto: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            symbol: { type: 'string' },
            rank: { type: 'number' },
            type: { type: 'string' },
            isActive: { type: 'boolean' },
            logo: { type: 'string' },
            price: { type: 'number' },
            marketCap: { type: 'number' },
            volume24h: { type: 'number' },
            percentChange24h: { type: 'number' },
          },
        },
        CryptoDetail: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            symbol: { type: 'string' },
            rank: { type: 'number' },
            type: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string' },
            startedAt: { type: 'string' },
            proofType: { type: 'string' },
            hashAlgorithm: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            price: { type: 'number' },
            marketCap: { type: 'number' },
            volume24h: { type: 'number' },
            percentChange24h: { type: 'number' },
            percentChange7d: { type: 'number' },
            totalSupply: { type: 'number' },
            maxSupply: { type: 'number' },
            athPrice: { type: 'number' },
            athDate: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

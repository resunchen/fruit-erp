import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '水果供应链系统 API',
      version: '1.0.0',
      description: '水果供应链全流程管理系统的 RESTful API 文档',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user', 'manager'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AuthData: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT Token',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
            },
            data: {
              type: 'object',
              nullable: true,
            },
            message: {
              type: 'string',
            },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
            },
            data: {
              type: 'null',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);

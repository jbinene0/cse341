const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book Club API',
    description: 'A REST API for managing a book club library and its members. Includes GitHub OAuth authentication.',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  tags: [
    { name: 'Books', description: 'Endpoints for managing the book library' },
    { name: 'Members', description: 'Endpoints for managing book club members' },
    { name: 'Auth', description: 'GitHub OAuth authentication endpoints' },
  ],
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);

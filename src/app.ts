import fastify from 'fastify';
import { uploadController } from './controllers/upload';
import { ZodError } from 'zod';

export const app = fastify();

app.post('/upload', uploadController);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ error_code: 'INVALID_DATA', error_description: error.format() });
  }
});

import fastify from 'fastify';
import { uploadController } from './controllers/upload';

export const app = fastify();

app.post('/upload', uploadController);

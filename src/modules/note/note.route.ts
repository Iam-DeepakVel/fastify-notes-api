import { FastifyInstance } from 'fastify';
import {
  createNoteHandler,
  deleteNoteHandler,
  getNotesHandler,
  updateNoteHandler,
} from './note.controller';

async function noteRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/add',
    {
      onRequest: [fastify.authenticate],
    },
    createNoteHandler
  );

  fastify.get(
    '/all',
    {
      onRequest: [fastify.authenticate],
    },
    getNotesHandler
  );

  fastify.put(
    '/update/:id',
    {
      onRequest: [fastify.authenticate],
    },
    updateNoteHandler
  );

  fastify.delete(
    '/delete/:id',
    {
      onRequest: [fastify.authenticate],
    },
    deleteNoteHandler
  );
}

export default noteRoutes;

import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from './user.controller';

async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerHandler);

  fastify.post('/login', loginHandler);
}

export default userRoutes;

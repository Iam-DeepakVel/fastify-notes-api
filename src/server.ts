import 'dotenv/config';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import userRoutes from './modules/user/user.route';
import fastifyJwt, { JWT } from '@fastify/jwt';
import noteRoutes from './modules/note/note.route';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
    jwt: JWT;
    config: {
      MONGO_URI: string;
      PORT: number;
      JWT_SECRET: string;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      _id: string;
      name: string;
      email: string;
    };
  }
}

export default function buildServer() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  fastify.addHook('preHandler', (req, reply, next) => {
    req.jwt = fastify.jwt;
    return next();
  });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ status: 'OK', port: '3100' });
  });

  fastify.register(userRoutes, { prefix: 'api/users' });
  fastify.register(noteRoutes, { prefix: 'api/notes' });

  return fastify;
}

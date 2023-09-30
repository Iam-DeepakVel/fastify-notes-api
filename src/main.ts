import Fastify, { FastifyRequest, FastifyReply } from 'fastify';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ status: 'OK', port: '3100' });
});

// Run server
fastify.listen({ port: 3100 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server is now listening on ${address}`);
});

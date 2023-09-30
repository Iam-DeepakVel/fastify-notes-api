import { connectDB } from './db/db';
import buildServer from './server';

const fastify = buildServer();

// Run server
fastify.listen({ port: 3100 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Connect to Database
  connectDB();

  fastify.log.info(`Server is now listening on ${address}`);
});

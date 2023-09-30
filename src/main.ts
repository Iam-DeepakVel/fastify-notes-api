import { connectDB } from './db/db';
import buildServer from './server';
import { config } from './utils/config';

const fastify = buildServer();

// Run server
fastify.listen({ port: config.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Connect to Database
  connectDB();

  fastify.log.info(`Server is now listening on ${address}`);
});

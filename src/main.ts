import 'dotenv/config';
import { connectDB, disconnectDB } from './db/db';
import buildServer from './server';

const fastify = buildServer();

const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'] as const;

async function gracefulShutdown({
  signal,
  fastify,
}: {
  signal: (typeof signals)[number];
  fastify: Awaited<ReturnType<typeof buildServer>>;
}) {
  await fastify.close();

  await disconnectDB();

  process.exit(0);
}

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

for (let i = 0; i < signals.length; i++) {
  process.on(signals[i], () =>
    gracefulShutdown({
      signal: signals[i],
      fastify,
    })
  );
}

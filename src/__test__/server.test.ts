import { test } from 'tap';
import buildServer from '../server';

test('GET `/` route', async (t) => {
  t.plan(4);

  const fastify = await buildServer();

  t.teardown(() => {
    fastify.close();
  });

  fastify.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(
        response.headers['content-type'],
        'application/json; charset=utf-8'
      );
      t.same(response.json(), { status: 'OK', port: '3100' });
    }
  );
});

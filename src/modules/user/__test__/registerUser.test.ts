import { faker } from '@faker-js/faker';
import { test } from 'tap';
import buildServer from '../../../server';
import { connectDB, disconnectDB } from '../../../db/db';

test('POST `api/users/register` route - Create User Successfull', async (t) => {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const fastify = buildServer();
  await connectDB();

  const payload = { name, email, password };

  t.teardown(async () => {
    fastify.close();
    await disconnectDB();
  });

  // Register user
  const response = await fastify.inject({
    method: 'POST',
    url: '/api/users/register',
    payload,
  });

  t.equal(response.statusCode, 201);
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  t.same(response.json().message, 'Registration Successful');
  t.type(response.json().accessToken, 'string');
});

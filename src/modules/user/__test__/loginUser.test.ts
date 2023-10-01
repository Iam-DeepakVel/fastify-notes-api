import { faker } from '@faker-js/faker';
import { test } from 'tap';
import buildServer from '../../../server';
import { UserType } from '@fastify/jwt';
import { connectDB, disconnectDB } from '../../../db/db';

test("POST 'api/users/login' route", async () => {
  test('given the email and password are correct', async (t) => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const fastify = buildServer();
    await connectDB();

    t.teardown(async () => {
      fastify.close();
      await disconnectDB();
    });

    // Registers the user
    await fastify.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: {
        email,
        password,
        name,
      },
    });

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email,
        password,
      },
    });

    t.equal(response.statusCode, 200);

    const data = response.json();

    const verified = fastify.jwt.verify<UserType & { iat: number }>(
      data.accessToken
    );

    t.equal(verified.email, email);
    t.equal(verified.name, name);
    t.type(verified._id, 'string');
    t.type(verified.iat, 'number');
  });

  test('given the email and password are not correct', async (t) => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const fastify = buildServer();
    await connectDB();

    t.teardown(async () => {
      fastify.close();
      await disconnectDB();
    });

    // Registers the user
    await fastify.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: {
        email,
        password,
        name,
      },
    });

    // Login User
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email: 'wrong_email@gmail.com',
        password: 'wrong_password',
      },
    });

    t.equal(response.statusCode, 401);
    t.equal(response.json().message, 'Invalid Credentials');
  });
});

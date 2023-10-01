import { test } from 'tap';
import buildServer from '../../../server';
import { connectDB, disconnectDB } from '../../../db/db';
import { faker } from '@faker-js/faker';

test('DELETE `api/notes/delete/:id` route - Delete Note Successfull', async (t) => {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const fastify = buildServer();
  await connectDB();

  t.teardown(async () => {
    fastify.close();
    await disconnectDB();
  });

  const payload = { name, email, password };

  // Register user to get AccessToken
  const regiserResponse = await fastify.inject({
    method: 'POST',
    url: '/api/users/register',
    payload,
  });

  const { accessToken } = regiserResponse.json();

  // Create a note to delete
  const createNoteResponse = await fastify.inject({
    method: 'POST',
    url: '/api/notes/add',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    payload: {
      title: 'Test title',
      content: 'Test content',
    },
  });

  // Delete note
  const deleteNoteResponse = await fastify.inject({
    method: 'DELETE',
    url: `/api/notes/delete/${createNoteResponse.json()._id}`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  t.equal(deleteNoteResponse.statusCode, 200);
  t.same(deleteNoteResponse.json().message, 'Note Deleted Successfully');
});

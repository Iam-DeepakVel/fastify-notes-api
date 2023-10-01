import { test } from 'tap';
import buildServer from '../../../server';
import { connectDB, disconnectDB } from '../../../db/db';
import { faker } from '@faker-js/faker';

test('PUT `api/notes/update/:id` route - Update Note Successfull', async (t) => {
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

  // Create a note to update
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

  // Update note
  const updateNoteResponse = await fastify.inject({
    method: 'PUT',
    url: `/api/notes/update/${createNoteResponse.json()._id}`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    payload: {
      title: 'Updated title',
      content: 'Updated content',
    },
  });

  const updatedNote = updateNoteResponse.json();

  t.equal(updateNoteResponse.statusCode, 200);
  t.equal(
    updateNoteResponse.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.same(updatedNote.title, 'Updated title');
  t.same(updatedNote.content, 'Updated content');
});

import { test } from 'tap';
import buildServer from '../../../server';
import { connectDB, disconnectDB } from '../../../db/db';
import { faker } from '@faker-js/faker';
import { NoteModel } from '../note.model';

test('POST `api/notes/add` route - Create Note Successfull', async (t) => {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const fastify = buildServer();
  await connectDB();

  t.teardown(async () => {
    fastify.close();
    await NoteModel.deleteMany({});
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

  const note = createNoteResponse.json();

  t.equal(createNoteResponse.statusCode, 201);
  t.equal(
    createNoteResponse.headers['content-type'],
    'application/json; charset=utf-8'
  );
  t.same(note.title, 'Test title');
  t.same(note.content, 'Test content');
});

import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from './note.service';

export async function createNoteHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createNote>[number];
  }>,
  reply: FastifyReply
) {
  try {
    const { title, content } = request.body;
    const userId = request.user._id;
    const note = await createNote({ title, content, user: userId });
    reply.code(201).send(note);
  } catch (error) {
    fastify().log.error(error, 'Error Creating Note');
    return reply.code(500).send(error);
  }
}

export async function getNotesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Loggedin User's ID
    const userId = request.user._id;

    return getAllNotes(userId);
  } catch (error) {
    fastify().log.error(error, 'Error Fetching Notes');
    return reply.code(500).send(error);
  }
}

export async function updateNoteHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createNote>[number];
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { title, content } = request.body;
    const userId = request.user._id;

    if (!(await getNoteById(id))) {
      return reply.code(404).send({ message: 'Note not found' });
    }

    const note = await updateNote(id, { title, content, user: userId });

    reply.code(200).send(note);
  } catch (error) {
    fastify().log.error(error, 'Error Updating Note');
    return reply.code(500).send(error);
  }
}

export async function deleteNoteHandler(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    if (!(await getNoteById(id))) {
      return reply.code(404).send({ message: 'Note not found' });
    }

    await deleteNote(id);

    reply.code(200).send({ message: 'Note Deleted Successfully' });
  } catch (error) {
    fastify().log.error(error, 'Error Deleting Note');
    return reply.code(500).send(error);
  }
}

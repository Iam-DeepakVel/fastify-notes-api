import { CreateNoteDto } from './dtos/note.dtos';
import { NoteModel } from './note.model';

export function createNote(data: CreateNoteDto) {
  return NoteModel.create(data);
}

export function getAllNotes(userId: string) {
  return NoteModel.find({ user: userId }).populate('user', '_id email name');
}

export function updateNote(noteId: string, data: CreateNoteDto) {
  return NoteModel.findByIdAndUpdate(noteId, data, { new: true });
}

export function getNoteById(noteId: string) {
  return NoteModel.findById(noteId);
}

export function deleteNote(noteId: string) {
  return NoteModel.findByIdAndDelete(noteId);
}

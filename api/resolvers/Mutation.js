const md = require('marked').setOptions({ headerIds: true, sanitize: true });

const NoteModel = require('../models/note');

module.exports = {
  newNote: (parent, args, { db }) => {
    let html = md(args.content);
    return NoteModel.insertNote(args, html, db);
  },

  updateNote: (parent, args, { db }) => {
    let html = md(args.content);
    return NoteModel.updateNote(args.id, args.content, html, db);
  },

  deleteNote: (parent, args, { db }) => {
    return NoteModel.deleteNote(args.id, db);
  }
};

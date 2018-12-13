const NoteModel = require('../models/note');

module.exports = {
  singleNote: (parent, args, { db }) => {
    return NoteModel.readNote(args.id, db);
  },

  allNotes: (parent, args, { db }) => {
    return NoteModel.allNotes(db);
  }
};

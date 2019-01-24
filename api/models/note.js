const { ObjectId } = require('mongodb');
const UserModel = require('./user');

const NoteModel = {
  insertNote: async (note, html, userId, db) => {
    let newNote = {
      content: note.content,
      htmlContent: html,
      favoriteCount: 0,
      favoritedBy: [],
      created: new Date(),
      edited: new Date(),
      authorId: userId
    };

    const inserted = await db.collection('notes').insertOne(newNote);
    // Get the ID of the added note and save it as a string
    newNote.id = String(inserted.insertedId);
    // Grab the author info from the database
    newNote.author = await UserModel.getUserById(userId, db);
    return newNote;
  },

  deleteNote: async (id, userId, db) => {
    // check that user owns the note

    const deleted = await db
      .collection('notes')
      .deleteOne({ _id: ObjectId(id) });
    // deletedCount is 1 if object is deleted from db
    if (deleted.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  updateNote: async (id, update, html, db) => {
    // check that the user owns the note

    try {
      await db
        .collection('notes')
        .updateOne(
          { _id: ObjectId(id) },
          { $set: { content: update, htmlContent: html, edited: new Date() } }
        );
    } catch (err) {
      console.log(err);
      return new Error('Error updating note');
    }

    // TODO handle note not found

    // return the updated note
    return NoteModel.readNote(id, db);
  },

  readNote: async (id, db) => {
    // TODO handle note not found
    const found = await db.collection('notes').findOne({ _id: ObjectId(id) });
    found.id = String(found._id);
    return found;
  },

  allNotes: async db => {
    const notes = await db
      .collection('notes')
      .find({})
      .toArray();

    // add an ID property to each returned object
    notes.map(note => (note.id = String(note._id)));
    return notes;
  },

  myNotes: async (userId, db) => {
    // If no user ID is passed, return null
    if (!userId) {
      return;
    }

    // Find all notes with the user's author ID
    const notes = await db
      .collection('notes')
      .find({ authorId: userId })
      .toArray();

    // Grab the author info from the database
    const author = await UserModel.getUserById(userId, db);

    // add the ID and author values needed for our GraphQL queries
    notes.map(note => {
      note.id = String(note._id);
      note.author = author;
    });

    // add an ID property to each returned object
    notes.map(note => (note.id = String(note._id)));
    console.log(notes);
    return notes;
  }
};

module.exports = NoteModel;

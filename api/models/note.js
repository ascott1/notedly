const { ObjectId } = require('mongodb');
const UserModel = require('./user');

const NoteModel = {
  insertNote: async (note, html, userId, db) => {
    // If no user ID is passed, return null
    if (!userId) {
      return;
    }

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
    const deleted = await db
      .collection('notes')
      .deleteOne({ _id: ObjectId(id), authorId: userId });
    // deletedCount is 1 if object is deleted from db
    if (deleted.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  updateNote: async (id, update, html, userId, db) => {
    // Try updating the note
    // if matching ID found
    // if current user's ID matches the author
    try {
      await db
        .collection('notes')
        .updateOne(
          { _id: ObjectId(id), authorId: userId },
          { $set: { content: update, htmlContent: html, edited: new Date() } }
        );
    } catch (err) {
      return new Error('Error updating note');
    }

    // Return the note
    // Will be the updated note if users match, otherwise returns the original
    return NoteModel.readNote(id, db);
  },

  readNote: async (id, db) => {
    try {
      const found = await db.collection('notes').findOne({ _id: ObjectId(id) });
      found.id = String(found._id);
      return found;
    } catch (err) {
      return new Error('Note not found');
    }
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
    return notes;
  }
};

module.exports = NoteModel;

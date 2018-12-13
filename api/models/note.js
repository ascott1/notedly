const { ObjectId } = require('mongodb');

const NoteModel = {
  insertNote: async (note, html, db) => {
    let newNote = {
      content: note.content,
      htmlContent: html,
      favoriteCount: 0,
      favoritedBy: [],
      created: new Date(),
      edited: new Date()
    };

    const inserted = await db.collection('notes').insertOne(newNote);
    // get the ID of the added note and save it as a string
    newNote.id = String(inserted.insertedId);
    return newNote;
  },

  deleteNote: async (id, db) => {
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
    // TODO change to use findById?
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
  }
};

module.exports = NoteModel;

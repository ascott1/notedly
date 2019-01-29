const md = require('marked').setOptions({ headerIds: true, sanitize: true });
const mongoose = require('mongoose');

module.exports = {
  newNote: async (parent, { content }, { models, user }) => {
    // if no user context is passed, don't create a note
    if (!user) {
      return null;
    }

    // Access the User model to create the Note
    // Populate the author info
    // Return the results
    try {
      let note = await models.Note.create({
        content,
        htmlContent: md(content),
        favoriteCount: 0,
        author: mongoose.Types.ObjectId(user._id)
      });
      return note.populate('author').execPopulate();
    } catch (err) {
      return new Error('Error creating note');
    }
  },

  updateNote: async (parent, { content, id }, { models, user }) => {
    // Find the note and check if the user owns the note
    const note = await models.Note.findById(id).populate('author');
    if (user._id !== note.author._id.toString()) {
      return new Error('Permission denied');
    }

    // If the user and owner match, update the note, populate author info, & return results
    // Else throw an error
    try {
      let note = await models.Note.findByIdAndUpdate(
        id,
        {
          $set: {
            content,
            htmlContent: md(content)
          }
        },
        {
          new: true,
          useFindAndModify: false
        }
      );
      return note.populate('author').execPopulate();
    } catch (err) {
      return new Error('Error updating note');
    }
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    // Find the note and check if the user owns the note
    const note = await models.Note.findById(id);
    if (user._id !== note.author.toString()) {
      return new Error('Permission denied');
    }

    // If the note exists and the user has permissions, delete it & return true
    if (note) {
      await note.remove();
      return true;
    } else {
      return false;
    }
  }
};

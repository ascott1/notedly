const md = require('marked').setOptions({ headerIds: true, sanitize: true });
const mongoose = require('mongoose');
const { AuthenticationError } = require('apollo-server-express');

// All GraphQL mutations
// Some repetition included to simplify & help understanding/teaching
module.exports = {
  newNote: async (parent, { content }, { models, user }) => {
    // If no user context is passed, don't create a note
    if (!user) {
      throw new AuthenticationError();
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
    // If not a user, throw an Authentication Error
    // We check to see if the author owns the note in the query
    if (!user) {
      throw new AuthenticationError();
    }

    // If the user and owner match, update the note, populate author info, & return results
    // Else throw an error
    try {
      let note = await models.Note.findOneAndUpdate(
        {
          _id: id,
          author: {
            _id: user._id
          }
        },
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
    try {
      // Find the note and check if the user owns the note
      const note = await models.Note.findById(id);
      if (!user || user._id !== note.author.toString()) {
        throw new AuthenticationError();
      }
      // If the user, owns the note remove it and return true
      await note.remove();
      return true;
    } catch (err) {
      return new Error('Error deleting the note');
    }
  },

  toggleFavorite: async (parent, { id }, { models, user }) => {
    // If no user context is passed, don't create a note
    if (!user) {
      throw new AuthenticationError();
    }

    // Check to see if the user has already favorited the note
    // If so, remove the user from the favoritedBy array and subtract 1 from the favoriteCount count
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user._id);

    if (hasUser >= 0) {
      try {
        let note = await models.Note.findByIdAndUpdate(
          id,
          {
            $pull: {
              favoritedBy: mongoose.Types.ObjectId(user._id)
            },
            $inc: {
              favoriteCount: -1
            }
          },
          {
            new: true,
            useFindAndModify: false
          }
        );
        return note
          .populate('author')
          .populate('favoritedBy')
          .execPopulate();
      } catch (err) {
        return new Error('Error favoriting the note');
      }
    }

    // If the user hasn't favorited the note
    // Add the user's ID to the favorites and increment the favorites count
    try {
      let note = await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user._id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true,
          useFindAndModify: false
        }
      );
      return note
        .populate('author')
        .populate('favoritedBy')
        .execPopulate();
    } catch (err) {
      return new Error('Error favoriting the note');
    }
  }
};
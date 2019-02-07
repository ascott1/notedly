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
    try {
      return await models.Note.create({
        content,
        htmlContent: md(content),
        favoriteCount: 0,
        author: mongoose.Types.ObjectId(user._id)
      });
    } catch (err) {
      throw new Error('Error creating note');
    }
  },

  updateNote: async (parent, { content, id }, { models, user }) => {
    // If not a user, throw an Authentication Error
    // We check to see if the author owns the note in the query
    if (!user) {
      throw new AuthenticationError();
    }

    // If the user and owner match, update the note & return results
    // Else throw an error
    try {
      return await models.Note.findOneAndUpdate(
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
    } catch (err) {
      throw new Error('Error updating note');
    }
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    // If not a user, throw an Authentication Error
    // We check to see if the author owns the note in the query
    if (!user) {
      throw new AuthenticationError();
    }

    try {
      // If the user, owns the note remove it and return true
      await models.Note.findOneAndRemove({ _id: id, author: user._id });
      return true;
    } catch (err) {
      throw new Error('Error deleting the note');
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
        return await models.Note.findByIdAndUpdate(
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
            // Set new to true to return the updated doc
            new: true
          }
        );
      } catch (err) {
        throw new Error('Error favoriting the note');
      }
    }

    // If the user hasn't favorited the note
    // Add the user's ID to the favorites and increment the favorites count
    try {
      return await models.Note.findByIdAndUpdate(
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
    } catch (err) {
      throw new Error('Error favoriting the note');
    }
  }
};

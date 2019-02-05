const mongoose = require('mongoose');

// All GraphQL queries
// Some repetition included to simplify & help understanding/teaching
module.exports = {
  // Return a note with a given ID
  singleNote: async (parent, { id }, { models }) => {
    return await models.Note.findById(id);
  },

  // Return all of the notes in the DB
  notes: async (parent, args, { models }) => {
    return await models.Note.find();
  },

  // Return a paginated feed of notes
  noteFeed: async (parent, { page }, { models }) => {
    const total = await models.Note.estimatedDocumentCount();
    const limit = 10;
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const notes = await models.Note.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      notes,
      page,
      pages,
      total
    };
  },

  // Return all notes by the current user
  myNotes: async (parent, args, { models, user }) => {
    return await models.Note.find({ author: user._id });
  },

  // Returns all of the favorites for a given user ID
  userFavorites: async (parent, { id }, { models }) => {
    return await models.Note.find({
      favoritedBy: mongoose.Types.ObjectId(id)
    });
  },

  // Similar to userFavorites, returns the favorites of the current user
  myFavorites: async (parent, args, { models, user }) => {
    return await models.Note.find({
      favoritedBy: mongoose.Types.ObjectId(user._id)
    });
  },

  // Return a user with a given ID
  singleUser: async (parent, { id }, { models }) => {
    return await models.User.findById(id);
  },

  // Return all users.
  allUsers: async (parent, args, { models }) => {
    return await models.User.find();
  },

  // Return the current user's user info, a list of their notes, and a list of their favorites
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user._id);
  }
};

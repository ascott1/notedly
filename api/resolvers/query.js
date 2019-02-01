const mongoose = require('mongoose');

// All GraphQL queries
// Some repetition included to simplify & help understanding/teaching
module.exports = {
  // Return a note with a given ID and populate the author info
  singleNote: async (parent, { id }, { models }) => {
    return await models.Note.findById(id).populate('author');
  },

  // Return all of the notes in the DB and populate the author info
  notes: async (parent, args, { models }) => {
    return await models.Note.find().populate('author');
  },

  // Return a paginated feed of notes
  noteFeed: async (parent, { page }, { models }) => {
    // Options for the paginate query
    const options = {
      page,
      limit: 10,
      sort: { createdAt: -1 },
      populate: 'author'
    };

    // Return 10 notes, on a given page, sorted in descending order
    const feed = await models.Note.paginate({}, options);
    return {
      notes: feed.docs,
      page: feed.page,
      pages: feed.pages,
      total: feed.total
    };
  },

  // Return all notes by the current user and populate the author info
  myNotes: async (parent, args, { models, user }) => {
    return await models.Note.find({ author: user._id }).populate('author');
  },

  // Returns all of the favorites for a given user ID
  userFavorites: async (parent, { id }, { models }) => {
    return await models.Note.find({
      favoritedBy: mongoose.Types.ObjectId(id)
    }).populate('author');
  },

  // Similar to userFavorites, returns the favorites of the current user
  myFavorites: async (parent, args, { models, user }) => {
    return await models.Note.find({
      favoritedBy: mongoose.Types.ObjectId(user._id)
    }).populate('author');
  },

  // Return a user with a given ID
  singleUser: async (parent, { id }, { models }) => {
    let requestedUser = await models.User.findById(id);
    requestedUser.notes = await models.Note.find({ author: user._id });
    requestedUser.favorites = await models.Note.find({ favoritedBy: user._id });
    return requestedUser;
  },

  // Return all users.
  // NOTE: Will not return each user's list of notes and favorites
  allUsers: async (parent, args, { models }) => {
    return await models.User.find();
  },

  // Return the current user's user info, a list of their notes, and a list of their favorites
  me: async (parent, args, { models, user }) => {
    let me = await models.User.findById(user._id);
    me.notes = await models.Note.find({ author: user._id });
    me.favorites = await models.Note.find({ favoritedBy: user._id });
    return me;
  }
};

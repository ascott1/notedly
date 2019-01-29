module.exports = {
  singleNote: async (parent, { id }, { models }) => {
    return await models.Note.findById(id).populate('author');
  },

  allNotes: async (parent, args, { models }) => {
    return await models.Note.find().populate('author');
  },

  myNotes: async (parent, args, { models, user }) => {
    return await models.Note.find({ author: user._id }).populate('author');
  }
};

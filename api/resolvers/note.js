module.exports = {
  async author(note, args, { models }) {
    return await models.User.findById(note.author);
  },
  async favoritedBy(note, args, { models }) {
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  }
};

module.exports = {
  async notes(user, args, { models }) {
    return await models.Note.find({ author: user._id });
  },
  async favorites(user, args, { models }) {
    return await models.Note.find({ favoritedBy: user._id });
  }
};

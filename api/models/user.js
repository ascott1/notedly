const { ObjectId } = require('mongodb');

const UserModel = {
  getUser: async (id, db) => {
    // TODO change to use findById?
    // TODO handle note user found
    const found = await db.collection('users').findOne({ _id: ObjectId(id) });
    found.id = String(found._id);
    return found;
  },

  createOrFindUser: {}
};

module.exports = UserModel;

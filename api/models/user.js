const { ObjectId } = require('mongodb');

const UserModel = {
  // Find the user with the MongoDB _id
  getUserById: async (id, db) => {
    const found = await db.collection('users').findOne({ _id: ObjectId(id) });
    found.id = String(found._id);
    return found;
  },

  // Find a user based on the provider's ID
  getUserByProviderId: async (user, db) => {
    let found = await db
      .collection('users')
      .findOne({ providerId: user.providerId });
    if (found) {
      found.id = String(found._id);
      return found;
    }
    return;
  },

  // Create a new user or return an existing user
  createOrFindUser: async (user, db) => {
    let existingUser = await UserModel.getUserByProviderId(user, db);
    if (existingUser) {
      return existingUser;
    }

    const newUser = user;
    const inserted = await db.collection('users').insertOne(newUser);
    // get the ID of the added user and save it as a string
    newUser.id = String(inserted.insertedId);
    return newUser;
  }
};

module.exports = UserModel;

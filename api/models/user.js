const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    providerId: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    avatar: {
      type: String
    },
    Notes: [
      {
        type: ObjectId,
        ref: 'Note'
      }
    ],
    favorites: [
      {
        type: ObjectId,
        ref: 'Note'
      }
    ]
  },
  {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true
  }
);

// Use the mongoose-findorcreate plugin
// Useful for checking for an existing user before adding them to the db
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);
module.exports = User;

const mongoose = require('mongoose');

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
    }
  },
  {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;

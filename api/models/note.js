const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const ObjectId = mongoose.Schema.Types.ObjectId;

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    htmlContent: {
      type: String,
      required: true
    },
    favoriteCount: {
      type: Number,
      required: true
    },
    favoritedBy: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ],
    author: {
      type: ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true
  }
);

noteSchema.plugin(mongoosePaginate);
const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

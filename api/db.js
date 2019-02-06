const mongoose = require('mongoose');

module.exports = {
  connect: async DB_HOST => {
    mongoose.set('useNewUrlParser', true);
    // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
    // by default, you need to set it to false.
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(DB_HOST);
    mongoose.connection.on('error', err => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },

  close: async () => {
    await mongoose.connection.close();
  }
};

const mongoose = require('mongoose');

module.exports = {
  connect: async DB_HOST => {
    mongoose.set('useNewUrlParser', true);
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

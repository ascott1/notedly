const mongoose = require('mongoose');

module.exports = {
  connect: async DB_HOST => {
    // Use the Mongo driver's updated URL string parser
    mongoose.set('useNewUrlParser', true);
    // Use `findOneAndUpdate()` in place of findAndModify()
    mongoose.set('useFindAndModify', false);
    // Connect to the DB
    await mongoose.connect(DB_HOST);
    // Log an error if we fail to connect
    mongoose.connection.on('error', err => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );
      process.exit();
    });
  },

  //
  close: async () => {
    await mongoose.connection.close();
  }
};

/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection
  .once('open', () => console.log('Mongoose Connected Succesfully.'))
  .on('error', (error) => console.warn('Error:', error));

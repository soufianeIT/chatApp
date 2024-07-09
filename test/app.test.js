const { expect } = require('chai');
const mongoose = require('mongoose');
const Message = require('../models/message'); // Assure-toi d'avoir un fichier `models/message.js` pour le modèle

describe('Message Model', () => {
  before((done) => {
    mongoose.connect('mongodb://127.0.0.1:27017/test_chat', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoose.connection.once('open', () => done()).on('error', (error) => done(error));
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  it('should create a new message', (done) => {
    const msg = new Message({ username: 'User', message: 'Hello, world!' });
    msg.save((err, savedMsg) => {
      if (err) return done(err);
      expect(savedMsg.username).to.equal('User');
      expect(savedMsg.message).to.equal('Hello, world!');
      done();
    });
  });
});

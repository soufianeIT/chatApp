const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app'); 

describe('Chat App Integration Tests', () => {
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

  it('should serve the index.html file', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('should handle chat messages', (done) => {
    const msg = { username: 'User', message: 'Hello, world!' };

    request(app)
      .post('/chat') // Assume une route pour poster des messages
      .send(msg)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.username).to.equal('User');
        expect(res.body.message).to.equal('Hello, world!');
        done();
      });
  });
});

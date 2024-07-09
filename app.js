const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Chaîne de connexion MongoDB sans les options dépréciées
const dbUri = 'mongodb://127.0.0.1:27017/chat';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const MessageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

function getRandomUsername() {
  const randomNumber = Math.floor(Math.random() * 1000); // Génère un nombre aléatoire entre 0 et 999
  return `user${randomNumber}`;
}

app.use(express.static('public'));

io.on('connection', async (socket) => {
  console.log('A user connected');

  // Générer un nom d'utilisateur aléatoire pour cet utilisateur
  const username = getRandomUsername();

  // Envoyer les messages existants au nouvel utilisateur
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    socket.emit('init messages', messages);
  } catch (err) {
    console.error('Error retrieving messages:', err);
  }

  socket.on('chat message', (msg) => {
    const message = new Message({ ...msg, username });
    message.save().then(() => {
      io.emit('chat message', { ...msg, username });
    }).catch(err => console.error('Error saving message:', err));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

const app = require('./app');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));

  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  
  io.on('connection', socket => {
    socket.on('join-article', articleAuthorId => {
      socket.join(articleAuthorId);
    });
  });
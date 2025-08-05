const app = require('./app');
const mongoose = require('mongoose');
const { createServer } = require('http');

const server = createServer(app);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
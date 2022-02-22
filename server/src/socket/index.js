const socketIo = (io) => {
  // code here
  io.on('connection', (socket) => {
    console.log('Client connect', socket.id);
  })

}

module.exports = socketIo
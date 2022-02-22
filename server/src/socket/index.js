const {chat, user, profile} = require("../../models")


const socketIo = (io) => {
  // code here
  io.on('connection', (socket) => {
    console.log('Client connect', socket.id);

    socket.on('load admin contact', async () => {
      try {
        const adminContact = await user.findOne({
          include: [
            {
              model: profile,
              as: 'profile',
              attributtes: {
                exclude: ['createdAt, updatedAt']
              }
            }
          ],
          where: {
            status: "admin"
          },
          attributtes: {
            exclude: ['createdAt, updatedAt, password']
          }
        })
        
        socket.emit("admin contact", adminContact)

        console.log(adminContact);

      } catch (error) {
        console.log(error);
      }

    })

    socket.on('load customer contacts', async () => {
      try {
        let customerContacts = await user.findAll({
          include: [
            {
              model: profile,
              as: 'profile',
              attributtes: {
                exclude: ['createdAt', 'updatedAt']
              }
            },
            {
              model: chat,
              as: 'recipientMessage',
              attributtes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender']
              }
            },
            {
              model: chat,
              as: 'senderMessage',
              attributtes: {
                exclude: ['createdAt', 'updatedAt', 'idRecipient', 'idSender']
              }
            }
          ],
          where: {
            status: "custommer"
          },
          attributtes: {
            exclude: ['createdAt, updatedAt, password']
          }
        })


        customerContacts = JSON.parse(JSON.stringify(customerContacts))
        customerContacts = customerContacts.map(item => ({
          ...item,
          image: item.image ? process.env.PATH_FILE + item.image: null
        }))

        socket.emit("customer contacts", adminContact)

      } catch (error) {
        console.log(error);
      }

    })

    socket.on("disconnect", () => {
      console.log("client disconnect")
    })
  })
}

module.exports = socketIo
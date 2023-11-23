import fs from 'fs';

const getFileData = (fileName) => {
  const file = fs.readdirSync('./assets/files').find(file => file === fileName);
  const fileData = fs.readFileSync(`./assets/files/${file}`);
  return JSON.parse(fileData.toString());
}

export const onConnection = (socket, users, io) => {
    socket.on('subscribeToUpdates', ({fileName, userName}) => {
      socket.join(fileName);
      if (!users.has(fileName)) {
        // add user
        users.set(fileName, [userName]);
      } else {
        //update users list
        users.set(fileName, [...users.get(fileName), userName]);
      }
      io.to(fileName).emit('users', users.get(fileName));
      socket.emit('fileData', getFileData(fileName));
    });

    socket.on("updateFile", ({fileName, data}) => {
      fs.writeFileSync(`./assets/files/${fileName}`, data);
      socket.broadcast.to(fileName).emit('fileData', JSON.parse(data));
    });
  
    socket.on('unsubscribeFromUpdates', ({fileName, userName}) => {
        // remove user from list
        users.set(fileName, users.get(fileName).filter(user => user !== userName));
        // notify other users
        io.to(fileName).emit('users', users.get(fileName));
        socket.leave(fileName)
    });

    socket.on("disconnecting", () => {
      const fileName = [...socket.rooms.values()][1];
      const userName = socket.handshake.auth['userName'];
      if (fileName) {
        // remove user from list
        users.set(fileName, users.get(fileName).filter(user => user !== userName));
        // notify other users
        socket.to(fileName).emit('users', users.get(fileName));
      }
    });
}
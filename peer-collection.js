class PeerCollection {
  constructor() {
    this.rooms = {};
  }

  addUserToRoom(peerId, userName, roomId) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = new Room();
    }
    this.rooms[roomId].addUser(peerId, userName);
  }

  removeUserFromRoom(peerId, roomId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId].removeUser(peerId);
    }
  }

  getUsersFromRoom(roomId) {
    const users = this.rooms[roomId].users.map((user) => {
      return {
        peerId: user.peerId,
        userName: user.userName
      };
    });
    return users;
  }
}

class Room {
  constructor() {
    this.users = [];
  }

  addUser(peerId, userName) {
    const user = new User(peerId, userName);
    this.users.push(user);
  }

  removeUser(peerId) {
    this.users.splice(this.users.findIndex(user => user.peerId === peerId), 1);
  }
}

class User {
  constructor(peerId, userName) {
    this.peerId = peerId;
    this.userName = userName;
  }
}

module.exports = PeerCollection;
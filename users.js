// Private

var PlayerSide = {
    LEFT: 1,
    RIGHT: 2
};

// User definition
User = function (address) {
    this.address = address;
    this.name = address;
};

User.prototype.setSide = function(side) {
    this.side = side;
};

var users = {};
var sockets = {}

// Public

module.exports = {
    User: User,
    users: {
        getAll: function() {
            return users;
        },
        add: function (user, socket) {
            users[user.name] = user;
            sockets[user.name] = socket;
        },
        remove: function(user) {
            delete users[user.name];
        },
        getSocket: function (user) {
            if (user && user.name) {
                var socket = sockets[user.name];
                if (socket) {
                    return socket;
                }
            }
        }


    },
    userNames: {
        claim: function (name, user) {
            if (!name || users[name]) {
                return false;
            } else {
                delete users[user.name]
                users[name] = user;
                return true;
            }
        }
    }
};

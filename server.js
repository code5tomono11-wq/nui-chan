const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {};

io.on("connection", socket => {

    socket.on("createRoom", room => {

        socket.join(room);

        rooms[room] = [];

        rooms[room].push(socket.id);

    });

    socket.on("joinRoom", room => {

        socket.join(room);

        if(!rooms[room]){
            rooms[room] = [];
        }

        rooms[room].push(socket.id);

        io.to(room).emit("battleStart");

    });

    socket.on("move", data => {

        socket.to(data.room).emit("enemyMove", data);

    });

});

http.listen(3000, () => {
    console.log("server start");
});

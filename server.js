const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

let rooms = {};

io.on("connection",(socket)=>{

    socket.on("createRoom",()=>{

        let room =
        Math.floor(1000 + Math.random()*9000)
        .toString();

        rooms[room]=[];

        socket.join(room);

        rooms[room].push(socket.id);

        socket.emit("roomCreated",room);
    });

    socket.on("joinRoom",(room)=>{

        if(!rooms[room]){
            socket.emit(
                "errorMessage",
                "部屋がありません"
            );
            return;
        }

        socket.join(room);

        rooms[room].push(socket.id);

        io.to(room).emit("playerJoined");
    });

});

server.listen(process.env.PORT || 3000,()=>{
    console.log("server start");
});

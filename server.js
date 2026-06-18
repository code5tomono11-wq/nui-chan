const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("."));

http.listen(process.env.PORT || 3000);

io.on("connection",(socket)=>{

    console.log("接続");

    socket.on("createRoom",(room)=>{
        socket.join(room);
    });

    socket.on("joinRoom",(room)=>{
        socket.join(room);
        io.to(room).emit("battleStart");
    });

socket.on("move",(data)=>{

    socket.to(data.room).emit("enemyMove",{
        damage:data.damage
    });

});

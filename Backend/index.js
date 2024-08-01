const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send("Chat App");
});
io.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("joinRoom", (room) => { socket.join(room) });
    socket.on("sendMessage", ({ newMsg, room }) => {
        console.log(room, newMsg);
        io.in(room).emit("getLatestMessage", newMsg)
    })
});


server.listen(8000, () => {
    console.log("Server is running on port 8000");
})

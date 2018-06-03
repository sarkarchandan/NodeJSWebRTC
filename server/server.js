const http = require("http");
const express = require("express");
const path = require("path");
const publicPath = path.join(__dirname,"../public");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket) => {
  console.log("Connected to the client.");

  socket.emit("welcomeMessage", {
    user: "Server",
    message: "Welcome to the environment"
  });
  
  socket.on("disconnect", () => {
    console.log("Disconnected from client.");
  });

})


if(!module.parent) {
  server.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
  });
}



module.exports = {
  server
}



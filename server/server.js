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

if(!module.parent) {
  server.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
  });
}



module.exports = {
  server
}



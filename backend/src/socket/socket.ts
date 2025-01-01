import { Server } from "socket.io";
import http from 'http'
import expres from 'express'

const app = expres();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000'],
    methods: ['GET', 'POST']
  }
});

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
 };

const userSocketMap: {[key: string] : string} = {};

io.on('connection', (socket) => {
  console.log('User connect', socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User disconnect', socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})

export {app, server, io};
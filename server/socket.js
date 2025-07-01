import { Server } from "socket.io";

export let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://192.168.88.150:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("new-order", (order) => {
      socket.broadcast.emit("order-notify", order);
    });

    socket.on("update-order", (data) => {
      io.emit("order-update", data);
    });
  });
}

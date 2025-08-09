import { Server } from "socket.io";
import { handleAiChatSocket } from "./handleAIChatSocket";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    handleAiChatSocket(socket, io);
  });
};

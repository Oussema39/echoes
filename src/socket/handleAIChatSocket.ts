import { Server, Socket } from "socket.io";
import { ERROR_EVENT_NAMES, EVENT_NAMES } from "../constants/eventNames";
import GenAiService from "../services/genAiService";
import { readFileSync } from "fs";
import { join } from "path";

type MessageData = {
  prompt?: string;
};

export const handleAiChatSocket = (socket: Socket, _io: Server) => {
  socket.on(EVENT_NAMES.CHAT_SEND, async (data: MessageData) => {
    try {
      const prompt = data.prompt;

      if (!prompt) {
        socket.emit(ERROR_EVENT_NAMES.CHAT_SEND_ERROR, {
          prompt: "No prompt was received",
        });
        return;
      }

      const cssPath = join(
        process.cwd(),
        "public",
        "assets",
        "quillSnowStyles.css"
      );
      const cssFile = readFileSync(cssPath, "utf-8");

      const styledPrompt = prompt.includes("<styles-section>")
        ? prompt.replace("<styles-section>", cssFile)
        : prompt;

      const stream = await GenAiService.generateContentStream({
        contents: styledPrompt ?? "",
      });

      for await (const chunk of stream) {
        if (chunk.text) {
          socket.emit(EVENT_NAMES.CHAT_RECEIVE, chunk.text);
        }
      }
    } catch (error: any) {
      console.error(error);
      socket.emit(
        ERROR_EVENT_NAMES.CHAT_RECEIVE_ERROR,
        error?.message ?? "Something went wrong"
      );
    } finally {
      socket.disconnect();
    }
  });
};

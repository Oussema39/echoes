import express, { Application } from "express";
import routes from "./routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "./config/corsConfig";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket";

const app: Application = express();

app.use(cors(corsConfig));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsConfig });

registerSocketHandlers(io);

export default httpServer;

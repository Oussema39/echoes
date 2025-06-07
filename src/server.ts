import express, { Application } from "express";
import routes from "./routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "./config/corsConfig";

const app: Application = express();

app.use(cors(corsConfig));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

export default app;

import express, { Application } from "express";
import routes from "./routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

export default app;

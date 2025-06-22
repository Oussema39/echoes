import { CorsOptions } from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
].filter(Boolean);

export const corsConfig: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
};

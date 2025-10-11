import { CorsOptions } from "cors";

const devOrigins = ["http://localhost:3000", "http://192.168.1.2:3000"];

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NODE_ENV === "development" ? devOrigins : null,
]
  .flat()
  .filter(Boolean);

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

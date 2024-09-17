declare namespace NodeJS {
  interface ProcessEnv extends Record<string, string> {
    NODE_ENV: "production" | "development";
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_CONNECTION_STRING: string;
    PORT: number;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
  }
}

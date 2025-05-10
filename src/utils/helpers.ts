import { Response } from "express";

export const initSSE = (res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
};

export const getGoogleRedirectUrl = () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
};

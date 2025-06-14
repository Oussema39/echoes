import puppeteer, { LaunchOptions } from "puppeteer";

export const buildBrowser = async (options?: Partial<LaunchOptions>) => {
  const browser = await puppeteer.launch({
    ...(process.env.NODE_ENV === "production"
      ? {
          executablePath:
            "C:\\Program Files\\Chromium\\Application\\chrome.exe",
          args: ["--no-sandbox"],
        }
      : {}),
    headless: true,
    ...options,
  });

  return browser;
};

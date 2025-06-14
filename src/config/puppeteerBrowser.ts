import { join } from "path";
import puppeteer, { LaunchOptions } from "puppeteer";

export const buildBrowser = async (options?: Partial<LaunchOptions>) => {
  const browser = await puppeteer.launch({
    ...(process.env.NODE_ENV === "production"
      ? {
          executablePath: join(
            __dirname,
            "..",
            "chrome/linux-135.0.7049.114/chrome-linux64/chrome"
          ),
          args: ["--no-sandbox"],
        }
      : {}),
    headless: true,
    ...options,
  });

  return browser;
};

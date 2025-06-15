import puppeteer, { LaunchOptions } from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const buildBrowser = async (options?: Partial<LaunchOptions>) => {
  const exePath = await chromium.executablePath;

  const browser = await puppeteer.launch({
    executablePath: exePath,
    args: chromium.args,
    headless: chromium.headless,
    ...options,
  });

  return browser;
};

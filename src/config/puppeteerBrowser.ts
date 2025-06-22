import puppeteer, { LaunchOptions } from "puppeteer-core";

const findChromePath = (): string | undefined => {
  let executablePath;

  if (process.platform === "win32") {
    // Should be changed to let puppeteer find the executable itself
    executablePath =
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    executablePath ??= puppeteer.executablePath();
  } else {
    executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser";
  }
  return executablePath;
};

export const buildBrowser = async (options?: Partial<LaunchOptions>) => {
  const exePath = findChromePath();

  const args = [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ];

  const browser = await puppeteer.launch({
    executablePath: exePath,
    headless: true,
    args,
    ...options,
  });

  return browser;
};

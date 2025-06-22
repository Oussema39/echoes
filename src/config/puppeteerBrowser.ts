import puppeteer, { LaunchOptions } from "puppeteer-core";

const TIMEOUT = 6000; // 1 minute,

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
    "--no-sandbox", // Essential for Docker
    "--disable-setuid-sandbox", // Also essential for Docker
    "--disable-gpu", // Might help with resource issues
    "--disable-dev-shm-usage", // Important for Docker on many hosts
  ];

  const browser = await puppeteer.launch({
    executablePath: exePath,
    headless: true,
    args,
    timeout: TIMEOUT,
    ...options,
  });

  return browser;
};

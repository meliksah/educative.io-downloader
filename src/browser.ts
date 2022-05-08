import * as puppeteer from 'puppeteer';
import * as config from 'config';
import { ROOT_PATH, IS_HEADLESS } from './globals';
const fs = require('fs').promises;
import path = require("path");

const WITH_COOKIE: boolean = config.get('withCookie');
console.log(`WITH_COOKIE: ${WITH_COOKIE}`);

let browser: puppeteer.Browser;
let isSpecialBrowser = false;

async function launchBrowser(args?: object) {
  let configuration: puppeteer.LaunchOptions = {
    userDataDir: ROOT_PATH + 'data',
    headless: IS_HEADLESS
  };

  if (args) {
    configuration = {
      ...configuration,
      ...args
    };
  }

  browser = await puppeteer.launch(configuration);
}

export async function getBrowser(): Promise<puppeteer.Browser> {
  if (!browser) {
    await launchBrowser();
  }

  return browser;
}

export async function getSpecialBrowser(): Promise<puppeteer.Browser> {
  const specialArgs = {
    defaultViewport: null,
    args: ['--window-size=1920,0']
  };

  if (isSpecialBrowser) {
    return browser;
  }

  // If a browser is open but not special then close it
  if (browser) {
    await browser.close();
    browser = undefined;
  }

  if (!browser) {
    await launchBrowser(specialArgs);
  }

  isSpecialBrowser = true;
  return browser;
}

export async function getPage(): Promise<puppeteer.Page> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  let [page] = await browser.pages();
  if (!page) {
    page = await browser.newPage();
  }
  if(WITH_COOKIE) {
    const cookiesString = await fs.readFile(path.join(__dirname + '/../../config/cookie.json'));
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  }
  return page;
}

export async function closeBrowser(): Promise<void> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  await browser.close();
}

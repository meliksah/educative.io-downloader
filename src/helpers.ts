import * as fs from 'fs';
import * as util from 'util';
import * as readline from 'readline';
import { Page } from 'puppeteer';

export const access = util.promisify(fs.access);
export const mkdir = util.promisify(fs.mkdir);
export const writeFile = util.promisify(fs.writeFile);

export async function isDireectoryExists(path: string): Promise<boolean> {
  return (await isExists(path));
}

export async function isFileExists(path: string): Promise<boolean> {
  return (await isExists(path));
}

export async function isExists(path: string): Promise<boolean> {
  try {
    await access(path, fs.constants.F_OK);
  } catch (error) {
    return false;
  }

  return true;
}

export async function clickButton(page: Page, className: string, buttonLabel: string): Promise<boolean> {
  const isClicked = await page.evaluate(({ className, buttonLabel }) => {
    const elements = document.getElementsByClassName(className);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerHTML === buttonLabel) {
        (elements[i] as HTMLElement).click();
        return true;
      }
    }

    return false;
  }, { className, buttonLabel });

  return isClicked;
}

export async function askQuestion(query): Promise<string>{
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

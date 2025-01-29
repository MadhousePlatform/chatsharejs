import chalk from 'chalk';
import { DateTime } from 'luxon';
import fs from 'fs';

export default class LogToFile {
  time: string = chalk.dim.gray(`[${DateTime.now().toFormat('hh:mm:ss a')}]`);
  file: any;

  constructor() {
    const date = DateTime.now().toFormat('yyyy-LL-dd');

    // Open the file and place cursor at *end* of the file.
    this.file = fs.openSync(`${__dirname}/../logs/${date}.log`, 'a+', );
  }

  destruct() {
    fs.closeSync(this.file);
  }

  error(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/error] ${text}`);
  }

  warn(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/warn] ${text}`);
  }

  success(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/success] ${text}`);
  }

  info(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/info] ${text}`);
  }

  log(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/log] ${text}`);
  }

  debug(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/debug] ${text}`);
  }
}
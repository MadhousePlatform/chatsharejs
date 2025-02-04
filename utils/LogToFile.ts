import { DateTime } from 'luxon';
import fs from 'fs';

export default class LogToFile {
  time: string = `[${DateTime.now().toFormat('hh:mm:ss a')}]`;
  file: any;

  constructor() {
    const date: string = DateTime.now().toFormat('yyyy-LL-dd');

    // Open the file and place cursor at *end* of the file.
    this.file = fs.openSync(`${__dirname}/../logs/${date}.log`, 'a+', );
  }

  destruct() {
    fs.closeSync(this.file);
  }

  error(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/error] ${text}\n`);
  }

  warn(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/warn] ${text}\n`);
  }

  success(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/success] ${text}\n`);
  }

  info(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/info] ${text}\n`);
  }

  log(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/log] ${text}\n`);
  }

  debug(...text: string[]): void {
    fs.writeSync(this.file, `${this.time} [log/debug] ${text}\n`);
  }
}
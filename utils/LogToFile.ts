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

  error(text: string): void {
    this.output('debug', text);
  }

  warn(text: string): void {
    this.output('warn', text);
  }

  success(text: string): void {
    this.output('success', text);
  }

  info(text: string): void {
    this.output('info', text);
  }

  log(text: string): void {
    this.output('log', text);
  }

  debug(text: string): void {
    this.output('debug', text);
  }

  output(type: string, text: any) {
    fs.writeSync(this.file, `${this.time} [log/${type}] ${text}\n`)
  }
}

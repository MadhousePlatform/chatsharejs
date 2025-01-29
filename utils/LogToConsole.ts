import chalk, { ChalkInstance } from 'chalk';
import { DateTime } from 'luxon';
import { config } from "@/bootstrap.ts";

export default class LogToConsole {
  time: string = chalk.white(`[${DateTime.now().toFormat('hh:mm:ss a')}]`);

  error(...text: string[]): void {
    this.output(text, 'error', chalk.red);
  }

  warn(...text: string[]): void {
    this.output(text, 'warn', chalk.hex('#b88c43'));
  }

  success(...text: string[]): void {
    this.output(text, 'success', chalk.green);
  }

  info(...text: string[]): void {
    this.output(text, 'info', chalk.blue);
  }

  log(...text: string[]): void {
    this.output(text, 'log', chalk.white);
  }

  debug(...text: string[]): void {
    if (config.NODE_ENV !== "production") {
      this.output(text, 'debug', chalk.whiteBright.italic);
    }
  }

  private output(text: string[], type: string, color: ChalkInstance): void {
    // @ts-ignore
    console.log(color(`${this.time} [console/${type}] ${text}`), chalk.reset('\n'));
  }
}

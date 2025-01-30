import chalk, { ChalkInstance } from 'chalk';
import { DateTime } from 'luxon';
import { config } from "@/bootstrap.ts";

export default class LogToConsole {
  time: string = chalk.white(`[${DateTime.now().toFormat('hh:mm:ss a')}]`);

  error(...text: any): void {
    this.output(text, 'error', chalk.red);
  }

  warn(...text: any): void {
    this.output(text, 'warn', chalk.hex('#b88c43'));
  }

  success(...text: any): void {
    this.output(text, 'success', chalk.green);
  }

  info(...text: any): void {
    this.output(text, 'info', chalk.blue);
  }

  log(...text: any): void {
    this.output(text, 'log', chalk.white);
  }

  debug(...text: any): void {
    if (config.NODE_ENV !== "production") {
      this.output(text, 'debug', chalk.whiteBright.italic);
    }
  }

  private output(text: any, type: string, color: ChalkInstance): void {
    console.log(color(`${this.time} [console/${type}] ${text}` + chalk.reset()));
  }
}

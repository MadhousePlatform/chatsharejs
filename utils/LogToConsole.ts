import chalk, { ChalkInstance } from 'chalk';
import { DateTime } from 'luxon';
import config from "@/config.ts";

export default class LogToConsole {
  time: string = chalk.white(`[${DateTime.now().toFormat('hh:mm:ss a')}]`);

  error(...text: any): void {
    this.output('error', chalk.red, ...text);
  }

  warn(...text: any): void {
    this.output('warn', chalk.hex('#b88c43'), ...text);
  }

  success(...text: any): void {
    this.output('success', chalk.green, ...text);
  }

  info(...text: any): void {
    this.output('info', chalk.blue, ...text);
  }

  log(...text: any): void {
    this.output('log', chalk.white, ...text);
  }

  debug(...text: any): void {
    if (config.env === "production")
      this.output('debug', chalk.whiteBright.italic, ...text);
  }

  private output(type: string, color: ChalkInstance, ...text: any): void {
    console.log(color(`${this.time} [console/${type}] ${text}` + chalk.reset()));
  }
}

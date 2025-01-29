import dotenv from 'dotenv';
import LogToConsole from "#/LogToConsole.ts";
import LogToFile from "#/LogToFile.ts";
import axios from 'axios';

dotenv.config();

export const log = new LogToConsole();
export const flog = new LogToFile();
export const config = process.env;
export const request = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'chatshare/0.1.0',
    'Authorization': `Bearer ${config.SERVER_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.pterodactyl.v1+json',
  },
  withCredentials: true,
  baseURL: config.SERVER_API,
});

process.on('exit', (code) => {
  // Close open file handler.
  log.debug(`Exiting... Close file handlers. (Code ${code})`)
  flog.debug(`Exiting... Close file handlers. (Code ${code})`);
  flog.destruct();
})
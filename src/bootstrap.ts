import LogToConsole from "#/LogToConsole.ts";
import LogToFile from "#/LogToFile.ts";
import axios from 'axios';
import config from './config.ts';

export const log = new LogToConsole();
export const flog = new LogToFile();
export const request = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': `ChatShare (https://madhouseminers.com, ${config.version})`,
    'Authorization': `Bearer ${config.server.key}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.pterodactyl.v1+json',
  },
  withCredentials: true,
  baseURL: config.server.api,
});

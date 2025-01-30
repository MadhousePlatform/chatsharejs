import { config, flog, log } from "@/bootstrap.ts";
import express, { Express, Request, Response } from 'express';
import fs from "fs";
import npid from "npid";
import pm2 from 'pm2';

const app: Express = express();

fs.unlink('chathttp.pid', () => {
  log.debug('Deleting stale pidfile.')
});

const pid = npid.create('chathttp.pid');

app.post('/rehash', (req: Request, res: Response<any>) => {
  const bearer: string|undefined  = req.get('Authorization');
  if (bearer === config.INCOMING_KEY) {
    log.debug('Incoming Rehash');
    flog.info('Rehash command accepted. Restarting.');
    res.sendStatus(200);

    const pidfile = fs.readFileSync('../chatshare.pid', { flag: 'r' }).toString();

    pm2.restart(pidfile, () => {
      flog.info('Restarting ChatShare from rehash.');
      log.info('Restarting ChatShare from rehash.');
    });
  }
  flog.error('Invalid Bearer token.');
  log.error('Invalid Bearer token.');
})

app.listen({
  port: config.HTTP_PORT,
  hostname: config.HTTP_ADDR,
}, () => {
  log.debug(`HTTP server listening on ${config.HTTP_ADDR}:${config.HTTP_PORT}`);
})

process.on('exit', (code: number) => {
  doExit(code);
});

process.on('SIGHUP', (code: number) => {
  doExit(code);
});

process.on('SIGTERM', (code: number) => {
  doExit(code);
});

process.on('SIGINT', (code: number) => {
  doExit(code);
});

function doExit(code: number) {
  flog.error(`Unexpected exit. Error code: ${code}`);
  pid.removeOnExit();
}
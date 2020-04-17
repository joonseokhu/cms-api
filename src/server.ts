/* eslint-disable import/first */
import 'dotenv/config';
import 'reflect-metadata';
import os from 'os';
import http from 'http';
import chalk from 'chalk';
import Timing from '@utils/timing';
// import connectToMariaDB from '@/db/mariadb';
import connectToMongoDB from '@/db/mongodb';

const timing = Timing('Starting');

import app from './app';

const getIP = (): string => {
  const ifaces = os.networkInterfaces();
  const ips = Object.values(ifaces)
    .flat(2)
    .filter(({ address }) => !address.indexOf('192.168.'));
  return ips.length ? ips[0].address : '-.-.-.-';
};

const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(chalk.blue('🚀 Server is running'));
  console.log(chalk.blue(`🔗 Local:  http://127.0.0.1:${port}`));
  console.log(chalk.blue(`🔗 Subnet: http://${getIP()}:${port}`));
  // connectToMariaDB();
  connectToMongoDB(app);
  timing('Started');
});

import 'dotenv/config';
import 'reflect-metadata';
import http from 'http';
import chalk from 'chalk';
import app from './app';
import createConnectionToDatabase from '@/db/connection';

const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(chalk.blue('🚀  Server is running'));
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
  createConnectionToDatabase();
});

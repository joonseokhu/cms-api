import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import logger from 'morgan';
import api, { settlement } from '@/api/api.routes';
import graphql from '@/graphql';

const app = express();
const env = process.env.NODE_ENV === 'production';

if (env) {
  // production
  app.use(hpp());
  app.use(helmet());
  app.use(logger('combined'));
  app.use(cors({
    origin: process.env.DOMAIN,
    credentials: true,
  }));
} else {
  // development
  app.disable('etag');
  app.use(logger('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use('/api', api);
app.use('/graphql', graphql);
app.use(settlement);

export default app;

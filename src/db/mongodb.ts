/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import { Express } from 'express';

const {
  MD_HOST,
  MD_NAME,
} = process.env;

export default async (app: Express) => {
  const connection = await mongoose.connect(`${MD_HOST}/${MD_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  // app.locals.db = connection;
  console.log('🟢 MongoDB connected');
  console.log('');
  return connection;
};

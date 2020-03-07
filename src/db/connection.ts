import { createConnection } from 'typeorm';
import { Post } from '@/models/post.model';
import { Tag } from '@/models/tag.model';
import { User } from '@/models/user.model';

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

export default () => createConnection({
  type: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  entities: [
    Post,
    Tag,
    User,
  ],
  synchronize: true,
});

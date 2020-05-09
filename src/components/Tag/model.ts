import { USER } from '@/api/interfaces';
import { Schema, Document, model } from 'mongoose';

export interface Tag<T> extends Document {
  name: string;
  description: string;
  // entities: T[];
  // count: number;
  createdBy: USER;
  createdAt: Date;
  updatedAt: Date;
}

const ID = Schema.Types.ObjectId;

const createTagSchema = <T>(name: string, entityName: string) => {
  const TagSchema = new Schema<Tag<T>>({
    name: {
      type: String, required: true, unique: true, index: true,
    },
    description: { type: String },
    createdBy: { type: ID, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  });
  return model<Tag<T>>(name, TagSchema);
};

export default createTagSchema;

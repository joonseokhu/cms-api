import { Schema, Document, model } from 'mongoose';
import { User } from '@/components/User/model';
import { Entity, EntitySchema } from '@/components/UserContent/model';

const ID = Schema.Types.ObjectId;

export enum FileType {
  image = 'image',
  video = 'video',
  audio = 'audio',
  document = 'document',
  others = 'others',
}

export interface File<T> extends Document {
  key: string;
  fileName: string;
  url: string;
  type: FileType;
  ext: string;
  size: number;
  entity: T;
  createdBy: User;
  createdAt: Date;
}

export default <T>(name: string, entityName: string) => {
  const FileSchema = new Schema<File<T>>({
    key: { type: String, unique: true, index: true },
    fileName: { type: String },
    url: { type: String, unique: true },
    type: { type: String },
    ext: { type: String },
    size: { type: Number },
    entity: { type: ID, ref: entityName, required: true },
    createdBy: { type: ID, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now() },
  });
  return model<File<T>>(name, FileSchema);
};

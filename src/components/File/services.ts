import { Model, Document } from 'mongoose';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import createFileSchema, { File } from './model';
import { UploadResult } from './interfaces';

// const file = new File('File', 'multertest');

type ConstructorParams<T extends Document> = {
  name: string,
  entityName: string,
  entityModel: Model<T>,
  bucketName: string,
};
class FileService<T extends Document> {
  Model: Model<File<T>>;

  EntityModel: Model<T>;

  bucket: string;

  s3: aws.S3;

  upload: any;

  constructor(params: ConstructorParams<T>) {
    this.bucket = params.bucketName;
    this.s3 = new aws.S3({
      region: 'ap-northeast-2',
    });
    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucket,
        acl: 'public-read',
        metadata(req, file, cb) {
          const { originalname } = file;
          cb(null, {
            ext: originalname.split('.').slice(-1)[0],
            originalName: encodeURIComponent(originalname),
          });
        },
        key(req, file, cb) {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    });
    this.Model = createFileSchema<T>(params.name, params.entityName);
    this.EntityModel = params.entityModel;
  }

  private _uploadFile = (req): Promise<UploadResult> => new Promise((resolve, reject) => {
    this.upload.single('file')(req, null, err => {
      if (err) return reject(err);
      return resolve(req.file || req.files);
    });
  });

  private _deleteFile = id => new Promise((resolve, reject) => {
    this.s3.deleteObject({
      Bucket: this.bucket,
      Key: id,
    }, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });

  createFile = async (req, entityID) => {
    // console.dir(req, { depth: 1 });
    const uploaded = await this._uploadFile(req);
    const file = await this.Model.create({
      key: uploaded.key,
      fileName: uploaded.metadata.originalName,
      url: uploaded.location,
      type: uploaded.mimetype.split('/')[0],
      ext: uploaded.metadata.ext,
      size: uploaded.size,
      entity: entityID,
      createdBy: req.user,
    });
    const updated = await this.EntityModel.updateOne({ _id: entityID }, {
      $addToSet: {
        files: file.id,
      },
    });
    // return {
    //   uploaded,
    //   file,
    //   updated,
    // };
    return {
      url: uploaded.location,
      key: uploaded.key,
      id: file.id,
    };
  };

  deleteFile = async id => {
    const deleted = await this._deleteFile(id);
    const removed = await this.Model.findOneAndDelete({ key: id });

    return {
      deleted,
      removed,
    };
  };

  deleteFilesOfEntity = async id => {
    const files = await this.Model.find({ entity: id });
    const s3Result = await Promise.all(
      files.map(({ key }) => this._deleteFile(key)),
    );
    const dbResult = await this.Model.deleteMany({ entity: id });
    return {
      s3Result,
      dbResult,
    };
  };

  getAllFiles = async () => {
    const files = await this.Model.find();
    const count = await this.Model.countDocuments();

    return [files, count];
  };
}

export default FileService;

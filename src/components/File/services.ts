import { Model, Document } from 'mongoose';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import createFileSchema, { File } from './model';
import { UploadResult } from './interfaces';

// const file = new File('File', 'multertest');

class FileService {
  Model: Model<File>;

  bucket: string;

  s3: aws.S3;

  upload: any;

  constructor(name: string, bucket: string) {
    this.bucket = bucket;
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
    this.Model = createFileSchema(name);
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

  createFile = async req => {
    // console.dir(req, { depth: 1 });
    const file = await this._uploadFile(req);
    return this.Model.create({
      fileName: file.metadata.originalName,
      key: file.key,
      size: file.size,
      url: file.location,
      type: file.mimetype.split('/')[0],
      ext: file.metadata.ext,
      createdBy: req.user,
    });
  };

  deleteFile = async id => {
    const result = await this._deleteFile(id);
    return this.Model.findOneAndDelete({ key: id });
  };

  getAllFiles = async () => {
    const files = await this.Model.find();
    const count = await this.Model.countDocuments();

    return [files, count];
  };
}

export default FileService;

export interface UploadResult {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  size: number,
  bucket: string,
  key: string,
  acl: string,
  contentType: string,
  contentDisposition?: string,
  storageClass: string,
  serverSideEncryption?: string,
  metadata: {
    ext: string,
    originalName: string
  },
  location: string,
  etag: string,
  versionId?: undefined
}

import { Credentials, S3 } from 'aws-sdk';
import http from 'http';
import https from 'https';
import stream from 'stream';
import FileType from 'file-type';

import { FileUploadDTO } from '../models/FileUploadDTO';
import { FileUploadResult } from '../models/FileUploadResult';
import { FileService } from './FileService';

export class AwsS3FileService implements FileService {
  private readonly BUCKET: string;
  private readonly OBJECT_KEY_PREFIX: string;
  private readonly RESULT_URL_PREFIX: string;

  private readonly s3Client: S3;

  constructor(env = process.env) {
    this.BUCKET = env.S3_BUCKET;
    this.OBJECT_KEY_PREFIX = env.S3_OBJECT_KEY_PREFIX;
    this.RESULT_URL_PREFIX = env.S3_RESULT_URL_PREFIX;

    const endpoint = `https://${env.S3_HOST}`;

    const credentials = new Credentials({
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    });

    console.log({
      bucket: this.BUCKET,
      objectPrefix: this.OBJECT_KEY_PREFIX,
      resultUrlPrefix: this.RESULT_URL_PREFIX,
      endpoint,
      credentials,
    });

    this.s3Client = new S3({
      endpoint,
      credentials,
    });
  }

  public async uploadFile(
    fileUploadDTO: FileUploadDTO
  ): Promise<FileUploadResult> {
    const { sourceUrl, destinationFilepath } = fileUploadDTO;

    console.log(`Downloading file from ${sourceUrl}`);

    const fileBuffer = await this.getFileBuffer(sourceUrl);

    console.log('File stream obtained');

    const uploadedFileUrl = await this.uploadFileBufferToS3(
      fileBuffer,
      destinationFilepath
    );

    const result: FileUploadResult = {
      uploadedFileUrl,
    };

    return result;
  }

  private getHttpRequestClient(
    sourceUrlString: string
  ): typeof http | typeof https {
    const sourceUrl = new URL(sourceUrlString);

    const client = sourceUrl.protocol === 'https:' ? https : http;

    return client;
  }

  private async getFileBuffer(sourceUrl: string): Promise<Buffer> {
    const response = await fetch(sourceUrl);

    const arrayBuffer = await response.arrayBuffer();

    const fileBuffer = Buffer.from(arrayBuffer);

    return fileBuffer;
  }

  private async uploadFileBufferToS3(
    sourceFileBuffer: Buffer,
    destinationFilepath: string
  ): Promise<string> {
    const fileType = await FileType.fromBuffer(sourceFileBuffer);

    if (!fileType) {
      throw new Error('Invalid/unknown file type');
    }

    console.log(fileType);

    const objectKey = `${this.OBJECT_KEY_PREFIX}${destinationFilepath}.${fileType.ext}`;

    await this.s3Client
      .upload({
        Bucket: this.BUCKET,
        Key: objectKey,
        Body: sourceFileBuffer,
        ContentType: fileType.mime,
      })
      .promise();

    const uploadedFileUrl = `${this.RESULT_URL_PREFIX}${objectKey}`;

    console.log(`File uploaded - available at ${uploadedFileUrl}`);

    return uploadedFileUrl;
  }
}

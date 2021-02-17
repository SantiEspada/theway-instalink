import { FileUploadDTO } from '../models/FileUploadDTO';
import { FileUploadResult } from '../models/FileUploadResult';

export interface FileService {
  uploadFile(fileUploadDTO: FileUploadDTO): Promise<FileUploadResult>;
}

import { FileUploadDTO } from '../models/FileUploadDTO';
import { FileUploadResult } from '../models/FileUploadResult';
import { FileService } from './FileService';

export class FakeFileService implements FileService {
  public async uploadFile(
    fileUploadDTO: FileUploadDTO
  ): Promise<FileUploadResult> {
    const result: FileUploadResult = {
      uploadedFileUrl: fileUploadDTO.sourceUrl,
    };

    return result;
  }
}

import { AppConfig } from '../models/AppConfig';
import { AppConfigCreationDTO } from '../models/AppConfigCreationDTO';

export interface AppConfigRepository {
  create(creationDTO: AppConfigCreationDTO): Promise<AppConfig>;
  findLast(): Promise<AppConfig>;
}

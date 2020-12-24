import { ExternalPost } from '../models/ExternalPost';

export interface ExternalPostService {
  getPosts(from?: Date): Promise<ExternalPost[]>;
}

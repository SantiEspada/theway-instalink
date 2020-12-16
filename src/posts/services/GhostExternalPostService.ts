import GhostContentAPI, { GhostAPI, PostOrPage } from '@tryghost/content-api';

import { ExternalPost } from '../models/ExternalPost';
import { ExternalPostService } from './ExternalPostService';

export class GhostExternalPostService implements ExternalPostService {
  private readonly ghostClient: GhostAPI;

  constructor(env = process.env) {
    this.ghostClient = new GhostContentAPI({
      url: env.GHOST_API_URL,
      key: env.GHOST_API_KEY,
      version: 'v3',
    });
  }

  public async getPosts(fromDate?: Date): Promise<ExternalPost[]> {
    const fields = ['title', 'feature_image', 'published_at', 'url'];
    const order = 'published_at ASC';

    const filter = [];

    if (fromDate) {
      const dateFilter = `published_at:>${fromDate.toISOString()}`;

      filter.push(dateFilter);
    }

    const blogPosts = await this.ghostClient.posts.browse({
      fields,
      order,
      filter,
    });

    const posts = blogPosts.map(this.adaptGhostPostToExternalPost);

    return posts;
  }

  private adaptGhostPostToExternalPost(ghostPost: PostOrPage): ExternalPost {
    const externalPost: ExternalPost = {
      title: ghostPost.title,
      pictureUrl: ghostPost.feature_image,
      publishedAt: new Date(ghostPost.published_at),
      url: ghostPost.url,
    };

    return externalPost;
  }
}

import { URLSearchParams } from 'url';

import { ExternalPostService } from './ExternalPostService';
import { ExternalPost } from '../models/ExternalPost';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';

interface InstagramPost {
  permalink: string;
  caption: string;
  media_url: string;
  timestamp: string;
  id: string;
}

interface InstagramMediaResponse {
  data: InstagramPost[];
}

interface InstagramResponseError {
  error: {
    message: string;
  };
}

export class InstagramExternalPostService implements ExternalPostService {
  private readonly instagramApiUrl: string;
  private readonly instagramApiAccessToken: string;

  constructor(env = process.env) {
    this.instagramApiUrl = env.INSTAGRAM_API_URL;
    this.instagramApiAccessToken = env.INSTAGRAM_API_ACCESS_TOKEN;
  }

  public async getPosts(from?: Date): Promise<ExternalPost[]> {
    const instagramMediaRequest = await fetch(this.instagramMediaRequestUrl);

    const instagramMediaResponse:
      | InstagramMediaResponse
      | InstagramResponseError = await instagramMediaRequest.json();

    if ('error' in instagramMediaResponse) {
      throw new ApiError(
        `Error requesting Instagram posts: ${instagramMediaResponse.error.message}`,
        StatusCodes.BAD_GATEWAY
      );
    }

    const instagramPosts = instagramMediaResponse.data;

    const posts = instagramPosts.map(this.adaptInstagramPostToExternalPost);

    return posts;
  }

  private get instagramMediaRequestUrl(): string {
    const queryParams = new URLSearchParams({
      access_token: this.instagramApiAccessToken,
      fields: 'permalink,caption,media_url,timestamp',
    });

    const instagramMediaRequestUrl = `${this.instagramApiUrl}/me/media?${queryParams}`;

    return instagramMediaRequestUrl;
  }

  private adaptInstagramPostToExternalPost(
    instagramPost: InstagramPost
  ): ExternalPost {
    const externalPost: ExternalPost = {
      title: instagramPost.caption,
      pictureUrl: instagramPost.media_url,
      publishedAt: new Date(instagramPost.timestamp),
      url: instagramPost.permalink,
    };

    return externalPost;
  }
}

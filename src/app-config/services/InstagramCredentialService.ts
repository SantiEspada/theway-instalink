import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';
import { InstagramCredential } from '../models/AppConfig';

export class InstagramCredentialService {
  private readonly baseUrl: string;
  private readonly instagramApiUrl: string;
  private readonly instagramClientId: string;
  private readonly instagramClientSecret: string;

  constructor(env = process.env) {
    this.baseUrl = env.BASE_URL;
    this.instagramApiUrl = env.NEXT_PUBLIC_INSTAGRAM_API_URL; // FIXME: separate this from API_URL, PUBLIC one is the old api used for oauth still ant the other the current GraphQL one
    this.instagramClientId = env.INSTAGRAM_CLIENT_ID;
    this.instagramClientSecret = env.INSTAGRAM_CLIENT_SECRET;
  }

  public async getCredential(oauthCode: string): Promise<InstagramCredential> {
    const accessTokenRequestUrl = new URL(
      'oauth/access_token',
      this.instagramApiUrl
    );
    const accessTokenRequestBody =
      this.buildInstagramAccessTokenRequestBody(oauthCode);

    const response = await fetch(accessTokenRequestUrl, {
      method: 'POST',
      body: accessTokenRequestBody,
    });

    const responseData = await response.json();

    const { access_token: accessToken, error_message } = responseData;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // FIXME: get this from the token

    if (error_message) {
      throw new ApiError(error_message, StatusCodes.BAD_REQUEST);
    }

    const instagramCredential: InstagramCredential = {
      accessToken,
      expiresAt,
    };

    return instagramCredential;
  }

  private buildInstagramAccessTokenRequestBody(oauthCode: string): FormData {
    const formData = new FormData();
    const redirectUrl = new URL('api/oauth/instagram', this.baseUrl);

    formData.append('client_id', this.instagramClientId);
    formData.append('client_secret', this.instagramClientSecret);
    formData.append('redirect_uri', redirectUrl.href);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', oauthCode);

    return formData;
  }
}

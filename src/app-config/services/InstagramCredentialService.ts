import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../common/models/ApiError';
import { InstagramCredential } from '../models/AppConfig';

export class InstagramCredentialService {
  private readonly baseUrl: string;
  private readonly instagramApiUrl: string;
  private readonly instagramGraphApiUrl: string;
  private readonly instagramClientId: string;
  private readonly instagramClientSecret: string;

  constructor(env = process.env) {
    this.baseUrl = env.BASE_URL;
    this.instagramApiUrl = env.NEXT_PUBLIC_INSTAGRAM_API_URL; // FIXME: separate this from API_URL, PUBLIC one is the old api used for oauth still ant the other the current GraphQL one
    this.instagramGraphApiUrl = env.INSTAGRAM_API_URL;
    this.instagramClientId = env.INSTAGRAM_CLIENT_ID;
    this.instagramClientSecret = env.INSTAGRAM_CLIENT_SECRET;
  }

  public async getCredential(oauthCode: string): Promise<InstagramCredential> {
    const shortLivedToken = await this.requestShortLivedToken(oauthCode);

    const instagramCredential = await this.exchangeShortLivedTokenForCredential(
      shortLivedToken
    );

    return instagramCredential;
  }

  public async refreshCredential(
    oldCredential: InstagramCredential
  ): Promise<InstagramCredential> {
    const { accessToken: oldAccessToken } = oldCredential;

    const requestUrl = new URL(
      'refresh_access_token',
      this.instagramGraphApiUrl
    );
    requestUrl.searchParams.append('grant_type', 'ig_refresh_token');
    requestUrl.searchParams.append('access_token', oldAccessToken);

    const instagramCredential = await this.requestCredential(requestUrl);

    return instagramCredential;
  }

  private async requestShortLivedToken(oauthCode: string): Promise<string> {
    const requestUrl = new URL('oauth/access_token', this.instagramApiUrl);
    const requestBody = this.buildInstagramAccessTokenRequestBody(oauthCode);

    const response = await fetch(requestUrl, {
      method: 'POST',
      body: requestBody,
    });

    const responseData = await response.json();

    const { access_token: shortLivedToken, error_message } = responseData;

    if (error_message) {
      throw new ApiError(error_message, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return shortLivedToken;
  }

  private buildInstagramAccessTokenRequestBody(oauthCode: string): FormData {
    const body = new FormData();
    const redirectUrl = new URL('api/oauth/instagram', this.baseUrl);

    body.append('client_id', this.instagramClientId);
    body.append('client_secret', this.instagramClientSecret);
    body.append('redirect_uri', redirectUrl.href);
    body.append('grant_type', 'authorization_code');
    body.append('code', oauthCode);

    return body;
  }

  private async exchangeShortLivedTokenForCredential(
    shortLivedToken: string
  ): Promise<InstagramCredential> {
    const requestUrl = new URL('access_token', this.instagramGraphApiUrl);

    requestUrl.searchParams.append('grant_type', 'ig_exchange_token');
    requestUrl.searchParams.append('client_secret', this.instagramClientSecret);
    requestUrl.searchParams.append('access_token', shortLivedToken);

    const instagramCredential = await this.requestCredential(requestUrl);

    return instagramCredential;
  }

  private async requestCredential(
    requestUrl: URL
  ): Promise<InstagramCredential> {
    const response = await fetch(requestUrl, {
      method: 'GET',
    });

    const responseData = await response.json();
    const { access_token: accessToken, expires_in, error } = responseData;

    if (error) {
      throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const expiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000)
      : new Date(Date.now() + 60 * 60 * 1000); // Short-lived token requests don't return the expires_in property but do expire in 1h

    const instagramCredential: InstagramCredential = {
      accessToken,
      expiresAt,
    };

    return instagramCredential;
  }
}

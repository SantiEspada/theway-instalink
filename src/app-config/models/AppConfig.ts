import { Entity } from '../../common/models/Entity';

export interface InstagramCredential {
  accessToken: string;
  expiresAt: Date;
}

export interface AppConfig extends Entity {
  instagramCredential: InstagramCredential;
}

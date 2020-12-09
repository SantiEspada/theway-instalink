import { Entity } from '../../common/models/Entity';

export interface AuthSession extends Entity {
  email: string;
  nonce: string;
}

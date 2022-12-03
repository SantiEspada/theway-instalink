import { Interactor } from '../../common/modules/Interactor';
import { InstagramCredential } from '../models/AppConfig';
import { InstagramCredentialService } from '../services/InstagramCredentialService';
import { CreateAppConfigInteractor } from './CreateAppConfigInteractor';

type CreateInstagramCredentialInteractorInput = {
  oauthCode: string;
};
type CreateInstagramCredentialInteractorOutput = InstagramCredential;

export class CreateInstagramCredentialInteractor
  implements
    Interactor<
      CreateInstagramCredentialInteractorInput,
      CreateInstagramCredentialInteractorOutput
    >
{
  constructor(
    private readonly instagramCredentialService: InstagramCredentialService = new InstagramCredentialService(),
    private readonly createAppConfigInteractor: CreateAppConfigInteractor = new CreateAppConfigInteractor()
  ) {}

  public async interact(
    input: CreateInstagramCredentialInteractorInput
  ): Promise<InstagramCredential> {
    const { oauthCode } = input;

    const instagramCredential =
      await this.instagramCredentialService.getCredential(oauthCode);

    await this.createAppConfigInteractor.interact({ instagramCredential });

    return instagramCredential;
  }
}

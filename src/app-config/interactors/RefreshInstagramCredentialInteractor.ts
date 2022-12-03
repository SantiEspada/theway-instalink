import { Interactor } from '../../common/modules/Interactor';
import { InstagramCredential } from '../models/AppConfig';
import { InstagramCredentialService } from '../services/InstagramCredentialService';
import { CreateAppConfigInteractor } from './CreateAppConfigInteractor';
import { GetAppConfigInteractor } from './GetAppConfigInteractor';

type RefreshInstagramCredentialInteractorInput = void;
type RefreshInstagramCredentialInteractorOutput = InstagramCredential;

export class RefreshInstagramCredentialInteractor
  implements
    Interactor<
      RefreshInstagramCredentialInteractorInput,
      RefreshInstagramCredentialInteractorOutput
    >
{
  constructor(
    private readonly getAppConfigInteractor: GetAppConfigInteractor = new GetAppConfigInteractor(),
    private readonly instagramCredentialService: InstagramCredentialService = new InstagramCredentialService(),
    private readonly createAppConfigInteractor: CreateAppConfigInteractor = new CreateAppConfigInteractor()
  ) {}

  public async interact(
    _input: RefreshInstagramCredentialInteractorInput
  ): Promise<InstagramCredential> {
    const { instagramCredential: oldCredential } =
      await this.getAppConfigInteractor.interact();

    const newCredential =
      await this.instagramCredentialService.refreshCredential(oldCredential);

    await this.createAppConfigInteractor.interact({
      instagramCredential: newCredential,
    });

    return newCredential;
  }
}

import { useAuthGuard } from '../../auth/hooks/useAuthGuard';
import { BackstageApp } from '../../backstage';
import { withoutSsr } from '../../common/utils/withoutSsr';

export function BackstagePage() {
  const { authGuard } = useAuthGuard();

  return authGuard(<BackstageApp />);
}

export default withoutSsr(BackstagePage);

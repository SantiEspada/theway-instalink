import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthGuard } from '../../auth/hooks/useAuthGuard';
import { withoutSsr } from '../../common/utils/withoutSsr';
import BackstageHeader from '../../components/BackstageHeader';

import styles from './index.module.scss';

export function BackstageIndex() {
  const { token, user } = useAuth();
  const { authGuard } = useAuthGuard();

  const availableApps = [
    {
      label: 'Dashboard',
      value: '',
    },
    {
      label: 'Resume',
      value: 'resume',
    },
  ];

  const onCurrentAppChange = (newCurrentApp: string) => {
    console.log(newCurrentApp);
  };

  return authGuard(
    <div className={styles.container}>
      <BackstageHeader
        appName="Backstage"
        availableApps={availableApps}
        authToken={token}
        currentApp=""
        onCurrentAppChange={onCurrentAppChange}
        userEmail={user ? user.id : null}
      />
    </div>
  );
}

export default withoutSsr(BackstageIndex);

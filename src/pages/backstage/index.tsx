import { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthGuard } from '../../auth/hooks/useAuthGuard';
import { withoutSsr } from '../../common/utils/withoutSsr';
import BackstageHeader from '../../components/BackstageHeader';
import { DashboardApp } from './apps/dashboard';

import styles from './index.module.scss';

export function BackstageIndex() {
  const { token, user } = useAuth();
  const { authGuard } = useAuthGuard();

  const availableApps = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      Component: DashboardApp,
    },
  ];

  const [currentApp, setCurrentApp] = useState(availableApps[0]);

  const onCurrentAppChange = (newCurrentAppKey: string) => {
    const newCurrentApp = availableApps.find(
      ({ key }) => key === newCurrentAppKey
    );

    setCurrentApp(newCurrentApp);
  };

  return authGuard(
    <div className={styles.container}>
      <BackstageHeader
        appName="Backstage"
        availableApps={availableApps}
        authToken={token}
        currentApp={currentApp.key}
        onCurrentAppChange={onCurrentAppChange}
        userEmail={user ? user.id : null}
      />
      <div className={styles.appWrapper}>
        <currentApp.Component />
      </div>
    </div>
  );
}

export default withoutSsr(BackstageIndex);

import { useState } from 'react';

import { useAuth } from '../auth/hooks/useAuth';
import BackstageHeader from '../components/BackstageHeader';
import { DashboardApp } from './apps/dashboard';

import styles from './index.module.scss';

export function BackstageApp() {
  const { token, user } = useAuth();

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

  return (
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

import Head from 'next/head';
import { useState } from 'react';

import { useAuth } from '../auth/hooks/useAuth';
import BackstageHeader from '../components/BackstageHeader';
import { ConfigApp } from './apps/config/ConfigApp';
import { CreateLinkApp } from './apps/create-link/CreateLinkApp';
import { DashboardApp } from './apps/dashboard';

import styles from './index.module.scss';

export function BackstageApp() {
  const { token, user } = useAuth();

  const availableApps = [
    {
      key: 'create-link',
      label: 'Crear enlace',
      Component: CreateLinkApp,
    },
    {
      key: 'config',
      label: 'Configuración',
      Component: ConfigApp,
    },
    // {
    //   key: 'dashboard',
    //   label: 'Dashboard',
    //   Component: DashboardApp,
    // },
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
      <Head>
        <title>Backstage - The Way</title>
      </Head>
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

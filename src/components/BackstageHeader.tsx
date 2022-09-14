import { useRef } from 'react';

import { copyToClipboard } from '../common/utils/copyToClipboard';
import { LogoIcon } from './icons/LogoIcon';

import styles from './BackstageHeader.module.scss';

interface AppOption {
  key: string;
  label: string;
}

export interface BackstageHeaderProps {
  appName: string;
  userEmail: string;
  authToken: string;
  availableApps: AppOption[];
  currentApp: string;
  onCurrentAppChange: (newCurrentApp: string) => void;
}

export default function BackstageHeader(props: BackstageHeaderProps) {
  const {
    appName,
    userEmail,
    authToken,
    availableApps,
    currentApp,
    onCurrentAppChange,
  } = props;

  const currentAppSelectRef = useRef<HTMLSelectElement>();

  const handleCurrentAppChange = () => {
    const newValue = currentAppSelectRef.current?.value;

    onCurrentAppChange(newValue);
  };

  const handleCopyToken = async () => {
    try {
      await copyToClipboard(authToken);
      alert('Token copied to clipboard');
    } catch (err) {
      alert(
        'Token failed to be copied to clipboard. Check the console for more details.'
      );
      console.error(err);
    }
  };

  return (
    <header className={styles.header}>
      <LogoIcon className={styles.header__logo} />
      <h1 className={styles.header__appName}>{appName}</h1>
      <div className={styles.header__userMenu}>
        <span
          className={styles.header__userMenu__email}
          onClick={handleCopyToken}
        >
          {userEmail}
        </span>
        <a href="/auth/logout" className={styles.header__userMenu__logout}>
          Cerrar sesión
        </a>
      </div>
      <div className={styles.header__appSelector}>
        <select
          name="currentApp"
          ref={currentAppSelectRef}
          onChange={handleCurrentAppChange}
          className={styles.header__appSelector__select}
        >
          {availableApps.map(({ label, key }) => (
            <option key={key} value={key} selected={key === currentApp}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

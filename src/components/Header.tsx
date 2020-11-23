import { LogoIcon } from './icons/LogoIcon';

import styles from './Header.module.scss';

interface HeaderProps {
  className?: string;
  title?: string;
}

export function Header(props: HeaderProps) {
  const { title = 'InstaLink', className = '' } = props;

  return (
    <header className={[className, styles.header].join(' ')}>
      <i className={styles.header__icon}>
        <LogoIcon />
      </i>
      <h1 className={styles.header__title}>{title}</h1>
    </header>
  );
}

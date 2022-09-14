import React from 'react';

import styles from './LoadingState.module.scss';

export interface LoadingStateProps {
  label: string;
}

export function LoadingState(props: LoadingStateProps) {
  const { label } = props;

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

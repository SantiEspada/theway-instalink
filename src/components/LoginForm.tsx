import { useEffect, useState } from 'react';

import { ComboInput } from './ComboInput';
import { ArrowRight } from './icons/ArrowRight';

import styles from './LoginForm.module.scss';

export interface LoginFormProps {
  error?: string;
  onSubmit({ email: string }): void;
}

export function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [dirty, setDirty] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);

    setDirty(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    setDirty(false);

    onSubmit({
      email,
    });
  };

  const shouldDisplayError = error && !dirty;

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.loginForm__title}>Iniciar sesión</h2>

      {shouldDisplayError && <p className={styles.loginForm__error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <ComboInput
          type="email"
          label="Dirección de email"
          id="email"
          icon={<ArrowRight />}
          onInputChange={handleEmailChange}
        />
      </form>
    </div>
  );
}

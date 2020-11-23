import { useState } from 'react';

import { ComboInput } from './ComboInput';
import { ArrowRight } from './icons/ArrowRight';

import styles from './LoginForm.module.scss';

export interface LoginFormProps {
  onSubmit({ email: string }): void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();

    onSubmit({
      email,
    });
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.loginForm__title}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <ComboInput
          type="email"
          label="Dirección de email"
          id="email"
          icon={<ArrowRight />}
          onInputChange={setEmail}
        />
      </form>
    </div>
  );
}

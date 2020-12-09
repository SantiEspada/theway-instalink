import Head from 'next/head';
import { useState } from 'react';

import { Header } from '../components/Header';
import { LoginForm } from '../components/LoginForm';

import styles from '../styles/Home.module.scss';

async function sendLoginLink(email: string): Promise<void> {
  const body = JSON.stringify({
    email,
  });

  const response = await fetch('/api/auth/sendLoginLink', {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/json',
      'accept-type': 'application/json',
    },
  });

  if (response.status !== 204) {
    const responseData = await response.json();

    throw new Error(responseData.error);
  }
}

enum Step {
  initial,
  waitingForConfirmation,
}

export default function Home() {
  const [error, setError] = useState<null | string>(null);
  const [step, setStep] = useState<Step>(Step.initial);

  const handleLogin = async (email: string) => {
    setError(null);

    try {
      await sendLoginLink(email);

      setStep(Step.waitingForConfirmation);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>InstaLink &bull; Iniciar sesión</title>
      </Head>

      <Header className={styles.header} />

      <main className={styles.main}>
        {{
          [Step.initial]: () => (
            <LoginForm
              error={error}
              onSubmit={({ email }) => handleLogin(email)}
            />
          ),
          [Step.waitingForConfirmation]: () => (
            <div>
              <h2>Revisa tu correo electrónico</h2>
              <p>
                Te hemos mandado un correo con un enlace para iniciar sesión.
              </p>
            </div>
          ),
        }[step]()}
      </main>
    </div>
  );
}

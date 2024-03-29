import { useEffect, useState } from 'react';
import Head from 'next/head';

import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthGuard } from '../../auth/hooks/useAuthGuard';
import { Header } from '../../components/Header';
import { LoginForm } from '../../components/LoginForm';

import styles from './login.module.scss';
import { withoutSsr } from '../../common/utils/withoutSsr';

enum Step {
  initial,
  waitingForConfirmation,
  verifyingSession,
}

function Login() {
  const [error, setError] = useState<null | string>(null);
  const [step, setStep] = useState<Step>(Step.initial);

  const { sendLoginLink, verifyLoginLink } = useAuth();
  const { authGuard } = useAuthGuard({
    redirectUrl: '/backstage',
    isLogin: true,
  });

  const handleLogin = async (email: string) => {
    setError(null);

    try {
      await sendLoginLink(email);

      setStep(Step.waitingForConfirmation);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQueryParams = async (location: string) => {
    const params = new URLSearchParams(location);

    if (params.has('sessionId')) {
      setStep(Step.verifyingSession);

      try {
        await verifyLoginLink(params.get('sessionId'));
      } catch (err) {
        setStep(Step.initial);

        setError(err.message);
      }
    }
  };

  useEffect(() => {
    handleQueryParams(window.location.search);
  }, [window.location.search]);

  return authGuard(
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
          [Step.verifyingSession]: () => (
            <div>
              <h2>Iniciando sesión...</h2>
            </div>
          ),
        }[step]()}
      </main>
    </div>
  );
}

export default withoutSsr(Login);

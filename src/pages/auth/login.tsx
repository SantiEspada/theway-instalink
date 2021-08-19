import { StatusCodes } from 'http-status-codes';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import {
  AuthSessionsRequestBody,
  AuthSessionsRequestResponse,
} from '../../auth/request-handlers/AuthSessionsRequestHandler';
import {
  AuthSessionsSessionIdVerifyRequestBody,
  AuthSessionsSessionIdVerifyRequestResponse,
} from '../../auth/request-handlers/AuthSessionsSessionIdVerifyRequestHandler';

import { Header } from '../../components/Header';
import { LoginForm } from '../../components/LoginForm';

import styles from './login.module.scss';

async function sendLoginLink(email: string): Promise<void> {
  const body: AuthSessionsRequestBody = {
    email,
  };

  const response = await fetch('/api/auth/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (response.status === StatusCodes.OK) {
    const { email, nonce } = responseData as AuthSessionsRequestResponse;

    // TODO: extract these to a hook/service/smthing so properties do not have to be duplicated for cleaning
    localStorage.setItem('instaLink.authSession.email', email);
    localStorage.setItem('instaLink.authSession.nonce', nonce);
  } else {
    throw new Error(responseData.error);
  }
}

async function verifyLoginLink(sessionId: string) {
  // TODO: extract these to a hook/service/smthing so properties do not have to be duplicated for cleaning
  const email = localStorage.getItem('instaLink.authSession.email');
  const nonce = localStorage.getItem('instaLink.authSession.nonce');

  const body: AuthSessionsSessionIdVerifyRequestBody = {
    id: sessionId,
    email,
    nonce,
  };

  const response = await fetch(`/api/auth/sessions/${sessionId}/verify`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (response.status === StatusCodes.OK) {
    const { token } =
      responseData as AuthSessionsSessionIdVerifyRequestResponse;

    // TODO: extract these to a hook/service/smthing so properties do not have to be duplicated for cleaning
    localStorage.setItem('instaLink.authSession.id', sessionId);
    localStorage.setItem('instaLink.authSession.token', token);
  } else {
    throw new Error(responseData.error);
  }
}

enum Step {
  initial,
  waitingForConfirmation,
  verifyingSession,
}

function Login() {
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

  const handleQueryParams = async (location) => {
    const params = new URLSearchParams(location);

    if (params.has('sessionId')) {
      setStep(Step.verifyingSession);

      try {
        await verifyLoginLink(params.get('sessionId'));

        const token = localStorage.getItem('instaLink.authSession.token');

        console.log(token);
      } catch (err) {
        setStep(Step.initial);

        setError(err.message);
      }
    }
  };

  useEffect(() => {
    handleQueryParams(window.location.search);
  }, [window.location.search]);

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

export default dynamic(() => Promise.resolve(Login), {
  ssr: false,
});

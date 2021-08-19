import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';
import { DeleteAuthSessionInteractor } from '../../auth/interactors/DeleteAuthSessionInteractor';

import { stringifyError } from '../../common/utils/stringifyError';

import Spinner from '../../components/Spinner';

import styles from './logout.module.scss';

interface LogoutProps {
  redirectUrl: string;
  error?: string;
}

interface LogoutParams extends ParsedUrlQuery {
  token?: string;
}

function clearLocalStorage(): void {
  // TODO: extract these to a hook/service/smthing so properties do not have to be duplicated for cleaning
  localStorage.removeItem('instaLink.authSession.email');
  localStorage.removeItem('instaLink.authSession.nonce');
  localStorage.removeItem('instaLink.authSession.id');
  localStorage.removeItem('instaLink.authSession.token');
}

export default function Logout(props: LogoutProps) {
  const { redirectUrl, error } = props;

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    clearLocalStorage();
    window.location.href = redirectUrl;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.spinningLoader}>
        <Spinner />
      </div>
    </div>
  );
}

const deleteAuthSessionInteractor = new DeleteAuthSessionInteractor();

export const getServerSideProps: GetServerSideProps<LogoutProps, LogoutParams> =
  async (context) => {
    const {
      params: { token },
    } = context;

    const logoutProps: LogoutProps = {
      redirectUrl: '/auth/login',
    };

    if (token) {
      try {
        await deleteAuthSessionInteractor.interact({ token });
      } catch (error) {
        logoutProps.error = stringifyError(error);
      }
    }

    return {
      props: logoutProps,
    };
  };

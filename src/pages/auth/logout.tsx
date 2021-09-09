import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

import { useAuth } from '../../auth/hooks/useAuth';
import { stringifyError } from '../../common/utils/stringifyError';
import { DeleteAuthSessionInteractor } from '../../auth/interactors/DeleteAuthSessionInteractor';

import Spinner from '../../components/Spinner';

import styles from './logout.module.scss';

interface LogoutProps {
  redirectUrl: string;
  error?: string;
}

interface LogoutParams extends ParsedUrlQuery {
  token?: string;
}

export default function Logout(props: LogoutProps) {
  const { redirectUrl, error } = props;

  const { clearState } = useAuth();

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    clearState();
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
    const token = context.params?.token;

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

import React, { useEffect, useState } from 'react';
import {
  AppConfig,
  InstagramCredential,
} from '../../../../app-config/models/AppConfig';
import { useApiClient } from '../../../../common/hooks/useApiClient';

import styles from './InstagramCredentialManager.module.scss';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const INSTAGRAM_API_URL = process.env.NEXT_PUBLIC_INSTAGRAM_API_URL;
const INSTAGRAM_CLIENT_ID = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
const EXPIRATION_WARNING_PERIOD_MS = 10 * 24 * 60 * 60 * 1000; // 10 days

export function InstagramCredentialInfo(props: {
  credential: InstagramCredential;
}) {
  const { credential } = props;

  if (!credential) {
    return <div>No hay configurada ninguna clave de acceso aún.</div>;
  }

  const isCredentialExpired = new Date(credential.expiresAt) > new Date();

  const isAboutToExpireDate = new Date(
    credential.expiresAt.getTime() - EXPIRATION_WARNING_PERIOD_MS
  );
  const isAboutToExpire = Date.now() >= isAboutToExpireDate.getTime();

  return (
    <div>
      <strong>
        {isCredentialExpired
          ? isAboutToExpire
            ? '🟡 Credencial válida (expira pronto)'
            : '🟢 Credencial válida'
          : '🔴 Credencial expirada'}
      </strong>
      <p>
        <strong>Fecha de expiración:</strong>{' '}
        {credential.expiresAt.toLocaleDateString()}{' '}
        {credential.expiresAt.toLocaleTimeString()}
      </p>
    </div>
  );
}

function getInstagramAuthUrl() {
  const instagramAuthUrl = new URL('oauth/authorize', INSTAGRAM_API_URL);
  const redirectUrl = new URL('api/oauth/instagram', BASE_URL);

  instagramAuthUrl.searchParams.append('client_id', INSTAGRAM_CLIENT_ID);
  instagramAuthUrl.searchParams.append('redirect_uri', redirectUrl.href);
  instagramAuthUrl.searchParams.append('scope', 'user_profile,user_media');
  instagramAuthUrl.searchParams.append('response_type', 'code');

  return instagramAuthUrl;
}

export function InstagramCredentialActions(props: {
  credential: InstagramCredential;
}) {
  const { credential } = props;

  const instagramAuthUrl = getInstagramAuthUrl();

  function RefreshCredential() {
    // FIXME: this should actually refresh the existing token instead of replacing it
    return (
      <a className={styles.button} href={instagramAuthUrl.href}>
        Refrescar clave
      </a>
    );
  }

  function CreateCredential() {
    return (
      <a className={styles.button} href={instagramAuthUrl.href}>
        Vincular cuenta
      </a>
    );
  }

  return (
    <div className={styles.action_container}>
      {credential ? <RefreshCredential /> : <CreateCredential />}
    </div>
  );
}

export function InstagramCredentialManager() {
  const apiClient = useApiClient();

  const [credential, setCredential] = useState<InstagramCredential | null>(
    null
  );

  async function getCredential() {
    const appConfig = await apiClient.get<AppConfig>('app-config');

    const { instagramCredential } = appConfig;

    if (instagramCredential) {
      instagramCredential.expiresAt = new Date(instagramCredential.expiresAt); // FIXME: we should have a way to handle this automatically
    }

    setCredential(instagramCredential);
  }

  useEffect(() => {
    apiClient && getCredential();
  }, [apiClient]);

  return (
    <div className={styles.container}>
      <InstagramCredentialInfo credential={credential} />
      <InstagramCredentialActions credential={credential} />
    </div>
  );
}

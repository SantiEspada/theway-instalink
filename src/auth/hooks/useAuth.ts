import { StatusCodes } from 'http-status-codes';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { boolean, is } from 'superstruct';
import { useLocalStorageState } from '../../common/hooks/useLocalStorageState';
import {
  AuthSessionsRequestBody,
  AuthSessionsRequestResponse,
} from '../request-handlers/AuthSessionsRequestHandler';
import {
  AuthSessionsSessionIdVerifyRequestBody,
  AuthSessionsSessionIdVerifyRequestResponse,
} from '../request-handlers/AuthSessionsSessionIdVerifyRequestHandler';

interface UseAuthUser {
  id: string;
}

export interface UseAuth {
  isLoggedIn: boolean;
  token: string | null;
  user: UseAuthUser | null;
  sendLoginLink(email: string): Promise<void>;
  verifyLoginLink(candidateSessionId: string): Promise<void>;
}

export function useAuth(): UseAuth {
  const [email, setEmail] = useLocalStorageState<string | null>(
    'instaLink.authSession.email',
    null
  );
  const [nonce, setNonce] = useLocalStorageState<string | null>(
    'instaLink.authSession.nonce',
    null
  );

  const [sessionId, setSessionId] = useLocalStorageState<string | null>(
    'instaLink.authSession.sessionId',
    null
  );
  const [token, setToken] = useLocalStorageState<string | null>(
    'instaLink.authSession.token',
    null
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UseAuthUser>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);

        const newUser: UseAuthUser = {
          id: decodedToken.aud as string,
        };

        setUser(newUser);
        setIsLoggedIn(true);
      } catch (error) {
        setToken(null);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [token]);

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
      const {
        email: newEmail,
        nonce: newNonce,
      } = responseData as AuthSessionsRequestResponse;

      setEmail(newEmail);
      setNonce(newNonce);
    } else {
      throw new Error(responseData.error);
    }
  }

  async function verifyLoginLink(candidateSessionId: string): Promise<void> {
    console.log(email);
    console.log(nonce);

    const body: AuthSessionsSessionIdVerifyRequestBody = {
      id: candidateSessionId,
      email,
      nonce,
    };

    const response = await fetch(
      `/api/auth/sessions/${candidateSessionId}/verify`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Accept-Type': 'application/json',
        },
      }
    );

    const responseData = await response.json();

    if (response.status === StatusCodes.OK) {
      const {
        token,
      } = responseData as AuthSessionsSessionIdVerifyRequestResponse;

      setSessionId(candidateSessionId);
      setToken(token);
    } else {
      throw new Error(responseData.error);
    }
  }

  return {
    isLoggedIn,
    token,
    user,
    sendLoginLink,
    verifyLoginLink,
  };
}

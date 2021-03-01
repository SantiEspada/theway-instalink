import { StatusCodes } from 'http-status-codes';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state';
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

const useAuthState = createPersistedState('count');

export interface UseAuth {
  isLoggedIn: boolean;
  token: string | null;
  user: UseAuthUser | null;
  sendLoginLink(email: string): Promise<void>;
  verifyLoginLink(candidateSessionId: string): Promise<void>;
}

export function useAuth(): UseAuth {
  const [email, setEmail] = useAuthState<string | null>(null);
  const [nonce, setNonce] = useAuthState<string | null>(null);

  const [sessionId, setSessionId] = useAuthState<string | null>(null);
  const [token, setToken] = useAuthState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useAuthState<boolean>(false);
  const [user, setUser] = useAuthState<UseAuthUser>(null);

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
    const execute = async (
      resolve: () => void,
      reject: (err?: any) => void
    ) => {
      // FIXME: this is horrible
      if (email === undefined || nonce === undefined) {
        setTimeout(() => execute(resolve, reject));
      }

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
        resolve();
      } else {
        reject(responseData.error);
      }
    };

    return new Promise(execute);
  }

  return {
    isLoggedIn,
    token,
    user,
    sendLoginLink,
    verifyLoginLink,
  };
}

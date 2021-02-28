import { StatusCodes } from 'http-status-codes';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { boolean, is } from 'superstruct';
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
  const [email, setEmail] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  useEffect(() => {
    console.log('me loguié');
    localStorage.setItem('instaLink.authSession.email', email);
  }, [email]);

  useEffect(() => {
    console.log('me loguié 2');
    localStorage.setItem('instaLink.authSession.nonce', nonce);
  }, [nonce]);

  useEffect(() => {
    localStorage.setItem('instaLink.authSession.sessionId', sessionId);
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem('instaLink.authSession.token', token);
  }, [token]);

  useEffect(() => {
    const localStorageEmail = localStorage.getItem(
      'instaLink.authSession.email'
    );

    if (localStorageEmail) {
      setEmail(localStorageEmail);
    }

    const localStorageNonce = localStorage.getItem(
      'instaLink.authSession.nonce'
    );
    if (localStorageNonce) {
      setNonce(localStorageNonce);
    }

    const localStorageToken: string | null = localStorage.getItem(
      'instaLink.authSession.token'
    );

    if (localStorageToken) {
      setToken(localStorageToken);
    }
  }, []);

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

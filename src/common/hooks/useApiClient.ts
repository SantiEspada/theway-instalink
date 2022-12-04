import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { ApiRequestMethod } from '../models/ApiRequest';

export class ApiClient {
  constructor(private readonly token: string) {}

  private get requestHeaders() {
    return {
      headers: {
        authorization: `Bearer ${this.token}`,
        'content-type': 'application/json',
      },
    };
  }

  public async get<TResponse = unknown>(
    path: string,
    queryParams?: Record<string, string>
  ): Promise<TResponse> {
    const requestUrl = `/api/${path}${
      queryParams ? `?${new URLSearchParams(queryParams)}` : ''
    }`;

    const response = await fetch(requestUrl, {
      ...this.requestHeaders,
      method: ApiRequestMethod.GET,
    });

    if (response.status === 403) {
      window.location.href = '/auth/logout'; // FIXME: we should find a better way to handle expired sessions
    }

    const responseJson = await response.json();

    return responseJson;
  }

  public async post<TResponse = unknown>(
    path: string,
    body?: unknown
  ): Promise<TResponse> {
    const response = await fetch(`/api/${path}`, {
      ...this.requestHeaders,
      method: 'POST',
      ...{ body: body ? JSON.stringify(body) : undefined },
    });

    const responseText = await response.text();

    try {
      return JSON.parse(responseText);
    } catch (error: unknown) {
      return null;
    }
  }
}

export function useApiClient() {
  const { token } = useAuth();

  const [apiClient, setApiClient] = useState<ApiClient>();

  useEffect(() => {
    setApiClient(new ApiClient(token));
  }, [token]);

  return apiClient;
}

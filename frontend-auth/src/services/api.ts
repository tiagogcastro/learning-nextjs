import axios, { AxiosError } from 'axios';
import { signOut } from 'contexts/AuthContext';
import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';

interface FailedRequestQueueData {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueData[] = [];

export function setupAPIClient(ctx: GetServerSidePropsContext | undefined = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextAuth.token']}`
    }
  });

  api.interceptors.response.use((response) => {
    return response;
  }, (error: any) => {
    const errorStatus = error.response?.status;

    if(errorStatus === 401) {
      if(error.response.data?.code === 'token.expired') {
        const { 'nextAuth.refreshToken': refreshToken } = cookies;

        let originalConfig = error.config;

        if(!isRefreshing) {
          isRefreshing = true;

          api.post('/refresh', {
            refreshToken
          })
          .then(response => {
            const { 
              token,
              refreshToken: refreshTokenResponse
            } = response.data;
    
            setCookie(ctx, 'nextAuth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });
    
            setCookie(ctx, 'nextAuth.refreshToken', refreshTokenResponse, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });
    
            failedRequestQueue.forEach(request => request.onSuccess(token));
            failedRequestQueue = [];
          })
          .catch((err) => {
            failedRequestQueue.forEach(request => request.onFailure(err));
            failedRequestQueue = [];

            if(typeof window !== 'undefined') {
              signOut();
            }
          })
          .finally(() => {
            isRefreshing = false;
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        })
      } else {
        if(typeof window !== 'undefined') {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
    }

    return Promise.reject(error);
  });

  return api;
}
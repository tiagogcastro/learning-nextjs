import axios, { AxiosError } from 'axios';
import { signOut } from 'contexts/AuthContext';
import { parseCookies, setCookie } from 'nookies';

interface FailedRequestQueueData {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueData[] = [];

export const api = axios.create({
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
      cookies = parseCookies();

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
  
          setCookie(undefined, 'nextAuth.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
          });
  
          setCookie(undefined, 'nextAuth.refreshToken', refreshTokenResponse, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
          });
  
          failedRequestQueue.forEach(request => request.onSuccess(token));
          failedRequestQueue = [];
        })
        .catch((err) => {
          failedRequestQueue.forEach(request => request.onFailure(err));
          failedRequestQueue = [];
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
      signOut();
    }
  }

  return Promise.reject(error);
})
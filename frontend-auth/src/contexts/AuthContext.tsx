import { setCookie, parseCookies, destroyCookie } from 'nookies';

import Router from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { api } from 'services/api';

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

export type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextAuth.token');
  destroyCookie(undefined, 'nextAuth.refreshToken');

  Router.push('/');
} 

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextAuth.token': token } = parseCookies();

    if(token) {
      api.get('/me')
        .then(response => {
          const { email, roles, permissions } = response.data;

          setUser({
            email,
            permissions,
            roles
          });
        })
        .catch(() => {
          signOut();
        })
    }

  }, []);

  // diego@rocketseat.team
  // 123456
  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      });
  
      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextAuth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
      setCookie(undefined, 'nextAuth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setUser({
        email,
        permissions,
        roles
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log({error});
    }
  }
  
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated,
          signIn,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  )
}
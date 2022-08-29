import { useQuery } from 'react-query';
import { api } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type GetUser = {
  users: User[];
}

async function getUsers(): Promise<User[]> {
  const { data } = await api.get<GetUser>('/users');

  const users = data.users.map((user) => {
    return {
      ...user,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
    };
  });

  return users;
}

function useUsers() {
  return useQuery('users', getUsers, {
    staleTime: 10000 * 5, // 5 seconds
  });
}

export {
  getUsers,
  useUsers,
}
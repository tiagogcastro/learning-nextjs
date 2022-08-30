import { useQuery } from 'react-query';
import { api } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type GetUserResponse = {
  users: User[];
  totalCount: number;
}

async function getUsers(page: number): Promise<GetUserResponse> {
  const { data, headers } = await api.get<GetUserResponse>('/users', {
    params: {
      page
    }
  });

  const totalCount = Number(headers['x-total-count']);

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

  return {
    users,
    totalCount
  };
}

interface UseUsersProps {
  page: number;
}

function useUsers({ page }: UseUsersProps) {
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10 , // 10 minutes
  });
}

export {
  getUsers,
  useUsers,
}
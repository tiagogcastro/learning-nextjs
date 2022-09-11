import { useAuth } from 'hooks/useAuth'
import { setupAPIClient } from 'services/api';
import { withSSRAuth } from 'utils/withSSRAuth';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <>
      <h1>Dashboard</h1>
      <p>E-mail: {user?.email}</p>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/me');
  console.log({data: response.data})
  return {
    props: {}
  };
});
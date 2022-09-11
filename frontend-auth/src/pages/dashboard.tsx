import { useAuth } from 'hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <>
      <h1>Dashboard</h1>
      <p>E-mail: {user?.email}</p>
    </>
  )
}
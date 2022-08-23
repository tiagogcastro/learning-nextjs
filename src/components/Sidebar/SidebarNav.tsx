import { Stack } from '@chakra-ui/react';
import { 
  RiContactsLine, 
  RiDashboardLine, 
  RiGitMergeLine, 
  RiInputMethodLine 
} from 'react-icons/ri';
import { NavLink } from './NavLink';
import { NavSection } from './NavSection';

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="Geral">
        <NavLink icon={RiDashboardLine}>Dashbord</NavLink>
        <NavLink icon={RiContactsLine}>Usuário</NavLink>
      </NavSection>
      <NavSection title="Automação">
        <NavLink icon={RiInputMethodLine}>Formulários</NavLink>
        <NavLink icon={RiGitMergeLine}>Automação</NavLink>
      </NavSection>
    </Stack>
  )
}
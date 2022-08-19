import { Box, Icon, Stack, Text, Link } from '@chakra-ui/react';
import React from 'react';
import { RiContactsLine, RiDashboardLine } from 'react-icons/ri';

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

export function NavSection({
  title,
  children
}: NavSectionProps) {
  return (
    <Box>
      <Text
        fontWeight="bold"
        color="gray.400"
        fontSize="small"
        textTransform="uppercase"
      >
        {title}
      </Text>
      <Stack spacing="4" mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  )
}
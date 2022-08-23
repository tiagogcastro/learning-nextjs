import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({
  showProfileData
}: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Tiago Gonçalves</Text>
          <Text color="gray.300" fontSize="small">tiaguin180@gmail.com</Text>
        </Box>
      )}

      <Avatar 
        size="md" 
        name="Tiago Gonçalves" 
        src="https://github.com/Tiaguin061.png"
      />
    </Flex>
  );
}
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Tiago Gonçalves</Text>
        <Text color="gray.300" fontSize="small">tiaguin180@gmail.com</Text>
      </Box>

      <Avatar 
        size="md" 
        name="Tiago Gonçalves" 
        src="https://github.com/Tiaguin061.png"
      />
    </Flex>
  );
}
import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';

import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Header } from '../../components/Header';
import { Pagination } from '../../components/Pagination';
import { SideBar } from '../../components/Sidebar';

export default function UserList() {
  const { data, isLoading, error } = useQuery('users', async () => {
    const response = await fetch('http://localhost:3000/api/users');

    const data = await response.json();

    const users = data.users.map(user => {
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
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  return (
    <>
      <Head>
        <title>Usuário - Listagem</title>
      </Head>
      <Box>
        <Header />

        <Flex
          w="100%"
          my="6"
          maxWidth={1480}
          mx="auto"
          px={["4", "4", "6"]}
        >
          <SideBar />

          <Box
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p="8"
            overflowX="auto" 
            maxWidth="auto"
          >
            <Flex
              mb="8"
              justify="space-between"
              align="center"
            >
              <Heading
                size="lg"
                fontWeight="normal"
              >
                Usuários
              </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                colorScheme='pink'
                leftIcon={
                  <Icon as={RiAddLine} />
                }
              >
                Criar novo
              </Button>
            </Link>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>  
            ) : error ? (
              <Flex justify="center">
                <Text>Falha ao obter dados dos usuários</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme='whiteAlpha'>
                  <Thead>
                    <Tr>
                      <Th
                        px={["4", "4", "6"]}
                        color="gray.300"
                        width="8"
                      >
                        <Checkbox colorScheme="pink"/>
                      </Th>
                      <Th>Usuário</Th>
                      {isWideVersion && (
                        <Th>Data de cadastro</Th>
                      )}
                      <Th width="8" />
                    </Tr>
                  </Thead>

                  <Tbody>
                    {data.map(user => (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink"/>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold">{user.name}</Text>
                            <Text fontSize="sm" color="gray.300">{user.email}</Text>
                          </Box>
                        </Td>
                        {isWideVersion && (
                          <Td>{user.createdAt}</Td>
                        )}
                        <Td>
                          <Button
                            as="a"
                            href="/"
                            size="sm"
                            colorScheme='purple'
                            gap="2"
                          >
                            <Icon as={RiPencilLine} />
                            {isWideVersion && 'Editar'}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    
                  </Tbody>
                </Table>

                <Pagination />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}
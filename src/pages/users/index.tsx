import { Box, Button, Checkbox, Flex, Heading, Icon, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';

import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Header } from '../../components/Header';
import { Pagination } from '../../components/Pagination';
import { SideBar } from '../../components/Sidebar';
import { api } from '../../services/api';
import { useUsers } from '../../services/hooks/useUsers';
import { queryClient } from '../../services/queryClient';

export default function UserList() {
  const [page, setPages] = useState(1);
  const { data, isFetching, isLoading, error } = useUsers({
    page
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`/users/${userId}`);

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutes
    })
  }

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

                {!isLoading && isFetching && (
                  <Spinner size="sm" color="gray.500" ml="4"/>
                )}
              </Heading>

            <NextLink href="/users/create" passHref>
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
            </NextLink>
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
                    {data?.users.map(user => (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink"/>
                        </Td>
                        <Td>
                          <Box>
                            <Link
                              href="#"
                              color="purple.400"
                              onMouseEnter={() => handlePrefetchUser(user.id)}
                            >
                              <Text fontWeight="bold">{user.name}</Text>
                            </Link>
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

                <Pagination
                  totalCountRegisters={data?.totalCount}
                  currentPage={page}
                  onPageChange={setPages}
                />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}
import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import Link from 'next/link';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from '../../components/Form/Input';
import { Header } from '../../components/Header';
import { SideBar } from '../../components/Sidebar';
import Head from 'next/head';

type CreateUserFormData = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string()
    .required('Nome obrigatório'),
  email: yup.string()
    .required('E-mail obrigatório')
    .email('E-mail inválido'),
  password: yup.string()
    .required('Senha obrigatória')
    .min(6, 'Mínimo 6 caracteres'),
  password_confirmation: yup.string()
    .oneOf([
      null,
      yup.ref('password')
    ], 'As senhas precisam ser iguais')
});

export default function CreateUser() {
  const { register, handleSubmit, formState } = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserFormSchema)
  });

  const createUserFormErrors = formState.errors;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(values);
  }

  return (
    <>
      <Head>
        <title>Usuário - Criar</title>
      </Head>
      <Box>
        <Header />

        <Flex
          w="100%"
          my="6"
          maxWidth={1480}
          mx="auto"
          px="6"
        >
          <SideBar />

          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <Heading size="lg" fontWeight="normal">
              Criar usuário
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid
                minChildWidth="240px"
                spacing={["6", "8"]}
                w="100%"
              >
                <Input
                  label="Nome completo"
                  {...register('name')}
                  error={createUserFormErrors.name}
                />
                <Input
                  label="E-mail"
                  {...register('email')}
                  error={createUserFormErrors.email}
                />
              </SimpleGrid>

              <SimpleGrid
                minChildWidth="240px"
                spacing={["6",
                "8"]}
                w="100%"
              >
                <Input
                  label="Senha"
                  type="password"
                  {...register('password')}
                  error={createUserFormErrors.password}
                />
                <Input
                  label="Confirmação da senha"
                  type="password"
                  {...register('password_confirmation')}
                  error={createUserFormErrors.password_confirmation}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify={["center", "flex-end"]}>
              <HStack spacing="4" width={["100%", "auto"]}>
                <Link href="/users" passHref>
                  <Button
                    as="a"
                    width={["100%", "auto"]}
                    colorScheme="whiteAlpha"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  width={["100%", "auto"]}
                  colorScheme="pink"
                  isLoading={formState.isSubmitting}
                >
                  Salvar
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
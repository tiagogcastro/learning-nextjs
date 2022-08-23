import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import { Input } from '../../components/Form/Input';
import { Header } from '../../components/Header';
import { SideBar } from '../../components/Sidebar';

export default function CreateUser() {
  return (
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
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
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
              <Input name="name" label="Nome completo" />
              <Input name="email" label="E-mail" />
            </SimpleGrid>

            <SimpleGrid
              minChildWidth="240px"
              spacing={["6",
              "8"]}
              w="100%"
            >
              <Input name="password" label="Senha" type="password" />
              <Input name="password_confirmation" label="Confirmação da senha" type="password" />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify={["center", "flex-end"]}>
            <HStack spacing="4" width={["100%", "auto"]}>
              <Button
                width={["100%", "auto"]}
                colorScheme="whiteAlpha"
              >
                Cancelar
              </Button>
              <Button
                width={["100%", "auto"]}
                colorScheme="pink"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
import { Text } from '@chakra-ui/react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/dashboard" passHref>
      <Text
        fontSize={["2xl", "3xl"]}
        fontWeight="bold"
        letterSpacing="tight"
        cursor="pointer"
        w="64"
      >
        dashgo
        <Text as="span" color="pink.500" ml="1">.</Text>
      </Text>
    </Link>
  );
}
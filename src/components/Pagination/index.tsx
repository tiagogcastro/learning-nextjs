import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { PaginationItem } from './PaginationItem';

interface PaginationProps {
  totalCountRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [... new Array(to, from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter(page => page > 0);
}

export function Pagination({
  totalCountRegisters,
  currentPage = 1,
  registersPerPage = 10,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.floor(totalCountRegisters / registersPerPage);

  const previousPages = currentPage > 1
    ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
    : [];

  const nextPages = currentPage < lastPage
    ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
    : [];

  return (
    <Stack
      spacing="6"
      mt="8"
      direction={["column", "row"]}
      justify="space-between"
      align="center"
    >
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>
      <HStack spacing="2">
        {currentPage > (1 + siblingsCount) && (
          <>
            <PaginationItem number={1} />
            {currentPage > (2 + siblingsCount) && (
              <Text
                color="gray.300"
                width="8"
                textAlign="center"
              >
                ...
              </Text>
            )}
          </>
        )}

        {previousPages.length > 0 &&  previousPages.map(page => (
          <PaginationItem key={page} number={page} />
        ))}

        <PaginationItem number={currentPage} isCurrent />

        {nextPages.length > 0 && nextPages.map(page => (
          <PaginationItem key={page} number={page} />
        ))}

        {(currentPage + siblingsCount) < lastPage && (
          <>
            { (currentPage + 1 + siblingsCount) < lastPage && (
              <Text
                color="gray.300"
                width="8"
                textAlign="center"
              >
                ...
              </Text>
            )}
            <PaginationItem number={lastPage} />
          </>
        )}
      </HStack>
    </Stack>
  );
}
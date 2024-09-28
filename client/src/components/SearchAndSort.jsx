import { Box, Input, Select, Text } from "@chakra-ui/react";

function SearchAndSort({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) {
  return (
    <Box
      height={{ base: "110px", md: "70px", lg: "70px" }}
      width="100%"
      rounded="md"
      display="flex"
      justifyContent={{
        base: "space-around",
        md: "space-between",
        lg: "space-between",
      }}
      flexDirection={{ base: "column", md: "row", lg: "row" }}
      px={3}
      fontWeight="600"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
      }}
    >
      <Box
        display="flex"
        width={{ base: "60%", md: "50%", lg: "40%" }}
        alignItems="center"
        gap={3}
      >
        <Text>Search:</Text>
        <Input
          borderColor="gray.500"
          rounded="md"
          border="1px"
          placeholder="Search..."
          size="sm"
          fontWeight="600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <Text width={{ base: "65px", md: "100px", lg: "100px" }}>Sort By:</Text>
        <Select
          borderColor="gray.500"
          rounded="md"
          border="1px"
          size="sm"
          fontWeight="600"
          width={{ base: "35%", md: "100%", lg: "100%" }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="recent">Most recently active</option>
          <option value="least">Least recently active</option>
          <option value="az">Alphabetically A-Z</option>
          <option value="za">Alphabetically Z-A</option>
        </Select>
      </Box>
    </Box>
  );
}

export default SearchAndSort;

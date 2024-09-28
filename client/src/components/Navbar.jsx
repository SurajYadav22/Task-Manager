import React, { useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Button,
  useColorModeValue,
  useDisclosure,
  Stack,
  Link,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, logout } from "../redux/auth-redux/action";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.userData);
  const defaultAvatarUrl =
    "data:image/jpeg;base64,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";
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box bg={useColorModeValue("#3076f4", "#3076f5")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Left Side - Menu Icon */}
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Menu Icon on larger screens */}
        <Box display={{ base: "none", md: "flex" }}>
          <IconButton
            icon={<HamburgerIcon />}
            aria-label={"Menu Icon"}
            variant="ghost"
            color="white"
          />
        </Box>

        {/* Right Side - Links / User Info */}
        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={4} alignItems={"center"}>
            {isAuthenticated ? (
              <>
                {/* Display User Avatar and Name */}
                <Avatar
                  size="sm"
                  src={user?.avatar || defaultAvatarUrl} // Use default avatar if no avatar exists
                  name={user?.first_name} // Avatar initials fallback
                />
                <Text color="white">
                  {user?.first_name} {user?.last_name}
                </Text>

                {/* Logout Button */}
                <Button
                  as={"a"}
                  onClick={handleLogout}
                  fontSize={"sm"}
                  fontWeight={600}
                  color="#3076f4"
                  bg="white"
                  borderWidth={2}
                  borderColor="#608cf5"
                  _hover={{
                    bg: "gray.700",
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" color="white">
                  Login
                </Link>
                <Button
                  as={"a"}
                  href="/register"
                  fontSize={"sm"}
                  fontWeight={600}
                  color="#3076f4"
                  bg="white"
                  borderWidth={2}
                  borderColor="#608cf5"
                  _hover={{
                    bg: "gray.700",
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>

      {/* Responsive Menu for small screens */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {isAuthenticated ? (
              <>
                {/* User Avatar and Name */}
                <Avatar
                  size="sm"
                  src={user?.avatar || defaultAvatarUrl}
                  name={user?.first_name}
                />
                <Text color="white">
                  {user?.first_name} {user?.last_name}
                </Text>
                {/* Logout Button */}
                <Button onClick={handleLogout} color="white">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" color="white">
                  Login
                </Link>
                <Link href="/register" color="white">
                  Signup
                </Link>
              </>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;

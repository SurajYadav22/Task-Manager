import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  Link,
  Stack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { login } from "../redux/auth-redux/action";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) newErrors.email = "Email is required.";
    else if (!emailPattern.test(data.email))
      newErrors.email = "Invalid email format.";

    if (!data.password) newErrors.password = "Password is required.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      dispatch(login(data));
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:4004/users/auth/google", "_self");
  };

  if (isAuthenticated) {
    toast({
      description: "Logged in successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <Box display="flex" justifyContent="center" py={8}>
      <Stack
        textAlign={{ base: "center", md: "left" }}
        mt={4}
        w={{ base: "90%", md: "70%", lg: "md" }}
        p={4}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={2} color="#3076f4">
          Login
        </Text>
        <Box
          w="full"
          p={{ base: 2, md: 8 }}
          borderColor="#608cf5"
          borderWidth={2}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Stack spacing={6}>
            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>

            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && (
                <Text color="red.500">{errors.password}</Text>
              )}
            </FormControl>

            <Button
              bg="#3076f4"
              _hover={{ bg: "#2c5c8c" }}
              color="white"
              width="full"
              type="submit"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {isLoading ? "Logging..." : "Login"}
            </Button>

            {error && <Text color="red.500">{error}</Text>}

            <Text textAlign="center" mt={4}>
              Don't have an account?{" "}
              <Link color="#3076f4" href="/register">
                Sign Up
              </Link>
            </Text>

            <Divider />

            <Button
              mx="auto"
              width={{ base: "full", md: "160px" }}
              _hover={{ bg: "#2c5c8c" }}
              fontSize="15px"
              bg="#3076f4"
              color="white"
              onClick={googleAuth}
            >
              Login with Google
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Login;

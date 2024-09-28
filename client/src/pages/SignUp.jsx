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
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/auth-redux/action";
import { Navigate } from "react-router-dom";

const SignUp = () => {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const { isRegistered, isLoading, error } = useSelector((state) => state.auth);

  const googleAuth = () => {
    window.open("http://localhost:4004/users/auth/google", "_self");
  };

  const validate = () => {
    const newErrors = {};
    const namePattern = /^[a-zA-Z]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    // First Name Validation
    if (!data.first_name) {
      newErrors.first_name = "First name is required.";
    } else if (!namePattern.test(data.first_name)) {
      newErrors.first_name = "First name must contain only letters.";
    }

    // Last Name Validation
    if (!data.last_name) {
      newErrors.last_name = "Last name is required.";
    } else if (!namePattern.test(data.last_name)) {
      newErrors.last_name = "Last name must contain only letters.";
    }

    // Email Validation
    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(data.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password Validation
    if (!data.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordPattern.test(data.password)) {
      newErrors.password =
        "Password must be at least 6 characters long, contain at least one letter, one number, and one special character.";
    }

    // Confirm Password Validation
    if (data.password !== data.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(register(data));
  };

  if (isRegistered) {
    toast({
      description: "Registered successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return <Navigate to={"/login"} />;
  }

  return (
    <Box display="flex" flexDir="column" alignItems="center" py={8}>
      <Stack
        textAlign={{ base: "center", md: "left" }}
        mt={8}
        w={{ base: "90%", md: "70%", lg: "md" }}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={2} color="#3076f4">
          Signup
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
            <FormControl
              id="first-name"
              isRequired
              isInvalid={!!errors.first_name}
            >
              <Input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={data.first_name}
                onChange={handleChange}
              />
              {errors.first_name && (
                <Text color="red.500">{errors.first_name}</Text>
              )}
            </FormControl>

            <FormControl
              id="last-name"
              isRequired
              isInvalid={!!errors.last_name}
            >
              <Input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={data.last_name}
                onChange={handleChange}
              />
              {errors.last_name && (
                <Text color="red.500">{errors.last_name}</Text>
              )}
            </FormControl>

            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleChange}
              />
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>

            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
              />
              {errors.password && (
                <Text color="red.500">{errors.password}</Text>
              )}
            </FormControl>

            <FormControl
              id="confirm-password"
              isRequired
              isInvalid={!!errors.confirm_password}
            >
              <Input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={data.confirm_password}
                onChange={handleChange}
              />
              {errors.confirm_password && (
                <Text color="red.500">{errors.confirm_password}</Text>
              )}
            </FormControl>

            <Button
              bg="#3076f4"
              _hover={{ bg: "#2c5c8c" }}
              color="white"
              width="full"
              type="submit"
              onClick={handleSubmit}
              isDisabled={isLoading}
            >
              {isLoading ? "Registering..." : "Signup"}
            </Button>

            {error && <Text color="red.500">{error}</Text>}

            <Text textAlign="center" mt={4}>
              Already have an account?{" "}
              <Link color="#3076f4" href="/login">
                Login
              </Link>
            </Text>

            <Divider />

            <Button
              mx="auto"
              width={{ base: "full", md: "160px" }}
              _hover={{ bg: "#2c5c8c" }}
              fontSize="15px"
              fontWeight="bold"
              bg="#3076f4"
              color="white"
              onClick={googleAuth}
            >
              Signup with Google
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SignUp;

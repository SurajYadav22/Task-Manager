import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { USER_LOGIN_SUCCESS } from "../redux/auth-redux/actionTypes";

const GoogleAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Get token and role from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Dispatch the login success action to Redux
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: { token, role },
      });

      // Show success toast
      toast({
        description: "Logged in successfully via Google",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      // Redirect to dashboard or desired route
      navigate("/dashboard");
    } else {
      // If token/role is missing, redirect to login
      navigate("/login");
    }
  }, [dispatch, navigate, toast]);

  return <div>Logging you in...</div>; // Optionally, you can add a loading spinner here
};

export default GoogleAuthSuccess;

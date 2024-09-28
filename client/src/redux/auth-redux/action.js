import axios from "axios";
import { USER_FETCH_FAILURE, USER_FETCH_REQUEST, USER_FETCH_SUCCESS, USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT_FAILURE, USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_REGISTER_FAILURE, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "./actionTypes";



export const register = (credentials) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST });
    try {
        const response = await axios.post(`http://localhost:4004/users/register`, credentials);
        dispatch({ type: USER_REGISTER_SUCCESS, payload: response.data });
        alert('Registered Successfully');
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(', ') || error.message;
        dispatch({ type: USER_REGISTER_FAILURE, payload: errorMessage });
    }
};


export const login = (credentials) => async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST })
    try {
        const res = await axios.post(`http://localhost:4004/users/login`, credentials);
        const data = res.data;
        dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('role', JSON.stringify(data.role));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(', ') || error.message;
        dispatch({ type: USER_LOGIN_FAILURE, payload: errorMessage });
        console.log(error);
    }
}

export const fetchUserData = () => async (dispatch) => {
    dispatch({ type: USER_FETCH_REQUEST });
    try {
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`http://localhost:4004/users/me`, config);
        dispatch({ type: USER_FETCH_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: USER_FETCH_FAILURE, payload: error.message });
    }
};



function getToken() {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
        return null;
    }
    try {
        const parsedToken = JSON.parse(tokenString);
        return parsedToken;
    } catch (e) {
        return tokenString;
    }
}


export const logout = () => async (dispatch) => {
    dispatch({ type: USER_LOGOUT_REQUEST });
    try {
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.get(`http://localhost:4004/users/logout`, config);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        dispatch({ type: USER_LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: USER_LOGOUT_FAILURE, payload: error.message });
    }
};
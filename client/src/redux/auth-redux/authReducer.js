import {
    USER_FETCH_FAILURE,
    USER_FETCH_REQUEST,
    USER_FETCH_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT_FAILURE,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_REGISTER_FAILURE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
} from "./actionTypes";




function getToken(tokenName) {
    const tokenString = localStorage.getItem(tokenName);

    if (!tokenString) {
        // Token does not exist
        return null;
    }

    // Try parsing the token as JSON
    try {
        const parsedToken = JSON.parse(tokenString);
        return parsedToken; // If successful, return the parsed token
    } catch (e) {
        // If parsing fails, return the original string
        return tokenString; // Return the plain string
    }
}

// Retrieve the token from localStorage
// const token = JSON.parse(localStorage.getItem('token'));
// const storedRole = JSON.parse(localStorage.getItem('role'));

const token = getToken('token');
const storedRole = getToken('role');


const initialState = {
    isRegistered: false,
    isAuthenticated: !!token || false, // Check if a token exists
    isLoading: false,
    error: null,
    user: {},
    isLoggedOut: null,
    userData: null,
    role: storedRole || null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { ...state, isLoading: true, error: null };
        case USER_REGISTER_SUCCESS:
            return { ...state, isLoading: false, isRegistered: true, user: action.payload };
        case USER_REGISTER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case USER_LOGIN_REQUEST:
            return { ...state, isLoading: true, error: null };
        case USER_LOGIN_SUCCESS:
            return { ...state, isLoading: false, isRegistered: true, isAuthenticated: true, user: action.payload.user, role: action.payload.role };
        case USER_LOGIN_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case USER_FETCH_REQUEST:
            return { ...state, isLoading: true, error: null };
        case USER_FETCH_SUCCESS:
            return { ...state, isLoading: false, userData: action.payload };
        case USER_FETCH_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case USER_LOGOUT_REQUEST:
            return { ...state, isLoading: true, error: null };
        case USER_LOGOUT_SUCCESS:
            return { ...state, isAuthenticated: false, isLoggedOut: true };
        case USER_LOGOUT_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

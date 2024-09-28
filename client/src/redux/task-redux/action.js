import axios from "axios";
import {
    SINGLE_TASK_GET_FAILURE,
    SINGLE_TASK_GET_REQUEST,
    SINGLE_TASK_GET_SUCCESS,
    TASK_CREATION_FAILURE,
    TASK_CREATION_REQUEST,
    TASK_CREATION_SUCCESS,
    TASK_DELETE_FAILURE,
    TASK_DELETE_REQUEST,
    TASK_DELETE_SUCCESS,
    TASK_GET_FAILURE,
    TASK_GET_REQUEST,
    TASK_GET_SUCCESS,
    TASK_UPDATE_FAILURE,
    TASK_UPDATE_REQUEST,
    TASK_UPDATE_SUCCESS,
} from "./actionTypes";

function getToken(tokenName) {
    const tokenString = localStorage.getItem(tokenName);

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

export const createTask = (data) => async (dispatch) => {
    dispatch({ type: TASK_CREATION_REQUEST });
    try {
        const token = getToken("token");

        if (!token) {
            alert("You must be logged in to create a task");
            return;
        }

        const config = {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(
            "http://localhost:4004/tasks/add-task",
            data,
            config
        );
        if (response.status >= 200 && response.status < 300) {
            const task = response.data;
            dispatch({ type: TASK_CREATION_SUCCESS, payload: task });
            alert("Task created successfully");
            dispatch(getTasks());
        } else {
            dispatch({ type: TASK_CREATION_FAILURE, payload: response.data });
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.errors?.join(", ") ||
            error.message;
        dispatch({ type: TASK_CREATION_FAILURE, payload: errorMessage });
    }
};

export const getTasks = () => async (dispatch) => {
    dispatch({ type: TASK_GET_REQUEST });
    try {
        const token = getToken("token");
        const config = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(
            `http://localhost:4004/tasks/view-tasks`,
            config
        );
        if (response.status >= 200 && response.status < 300) {
            const tasks = response.data;
            dispatch({ type: TASK_GET_SUCCESS, payload: tasks });
        } else {
            dispatch({ type: TASK_GET_FAILURE, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_FAILURE, payload: error });
    }
};
export const singleTaskFetch = (id) => async (dispatch) => {
    dispatch({ type: SINGLE_TASK_GET_REQUEST });
    try {
        const token = getToken("token");

        const config = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(
            `http://localhost:4004/tasks/view-task/${id}`,
            config
        );
        if (response.status >= 200 && response.status < 300) {
            const task = response.data;

            dispatch({ type: SINGLE_TASK_GET_SUCCESS, payload: task });
        } else {
            dispatch({ type: SINGLE_TASK_GET_FAILURE, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: SINGLE_TASK_GET_FAILURE, payload: error });
    }
};

export const updateTaskStatus = (taskId, status) => async (dispatch) => {
    dispatch({ type: TASK_UPDATE_REQUEST });
    try {
        const token = getToken("token");

        const config = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(
            `http://localhost:4004/tasks/update-task/${taskId}`,
            { status },
            config
        );
        if (response.status >= 200 && response.status < 300) {
            dispatch({ type: TASK_UPDATE_SUCCESS, payload: { taskId, status } });
        } else {
            dispatch({ type: TASK_UPDATE_FAILURE, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: TASK_UPDATE_FAILURE, payload: error });
    }
};

export const updateTask = (taskId, taskData) => async (dispatch) => {
    dispatch({ type: TASK_UPDATE_REQUEST });
    try {
        const token = getToken("token");
        const config = {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.put(
            `http://localhost:4004/tasks/edit-task/${taskId}`,
            taskData,
            config
        );
        if (response.status >= 200 && response.status < 300) {
            dispatch({
                type: TASK_UPDATE_SUCCESS,
                payload: { taskId, taskData },
            });
            dispatch(getTasks());
        } else {
            dispatch({ type: TASK_UPDATE_FAILURE, payload: response.data });
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.errors?.join(", ") ||
            error.message;
        dispatch({ type: TASK_UPDATE_FAILURE, payload: errorMessage });
    }
};

export const deleteTask = (taskId) => async (dispatch) => {
    dispatch({ type: TASK_DELETE_REQUEST });
    try {
        const token = getToken("token");

        const config = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.delete(
            `http://localhost:4004/tasks/delete-task/${taskId}`,
            config
        );
        if (response.status >= 200 && response.status < 300) {
            dispatch({ type: TASK_DELETE_SUCCESS, payload: response.data });
            alert("Task deleted successfully");
            dispatch(getTasks());
        } else {
            dispatch({ type: TASK_DELETE_FAILURE, payload: response.data });
        }
    } catch (error) {
        dispatch({ type: TASK_DELETE_FAILURE, payload: error });
    }
};

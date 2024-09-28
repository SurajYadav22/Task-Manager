import {
    SINGLE_TASK_GET_FAILURE,
    SINGLE_TASK_GET_REQUEST,
    SINGLE_TASK_GET_SUCCESS,
    TASK_CREATION_FAILURE, TASK_CREATION_REQUEST, TASK_CREATION_SUCCESS,
    TASK_DELETE_REQUEST,
    TASK_DELETE_SUCCESS,
    TASK_GET_FAILURE, TASK_GET_REQUEST, TASK_GET_SUCCESS,
    TASK_UPDATE_FAILURE, TASK_UPDATE_REQUEST, TASK_UPDATE_SUCCESS
} from "./actionTypes";

const initialState = {
    isLoading: false,
    error: null,
    tasks: [],
    singleTask: {},
    totalPages: 1,
    currentPage: 1,
    deletedTask: null
};

export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case TASK_CREATION_REQUEST:
        case TASK_GET_REQUEST:
        case TASK_DELETE_REQUEST:
        case TASK_UPDATE_REQUEST:
        case SINGLE_TASK_GET_REQUEST:
            return { ...state, isLoading: true, error: null };
        case TASK_CREATION_SUCCESS:
            return { ...state, isLoading: false, error: null, task: action.payload };

        case TASK_GET_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                tasks: action.payload
            };
        case TASK_UPDATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                tasks: state.tasks.map(task =>
                    task._id === action.payload.taskId
                        ? { ...task, status: action.payload.status }
                        : task
                ),
            };
        case SINGLE_TASK_GET_SUCCESS:
            return { ...state, isLoading: false, error: null, singleTask: action.payload };
        case TASK_DELETE_SUCCESS:
            return { ...state, isLoading: false, error: null, deletedTask: action.payload };
        case TASK_CREATION_FAILURE:
        case TASK_GET_FAILURE:
        case SINGLE_TASK_GET_FAILURE:
        case TASK_UPDATE_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

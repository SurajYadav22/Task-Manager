import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import {thunk} from 'redux-thunk'
import {logger} from 'redux-logger'
import { authReducer } from "./auth-redux/authReducer";
import { taskReducer } from "./task-redux/taskReducer";


const rootReducer = combineReducers({
    auth:authReducer,
    task:taskReducer
});

export const store = legacy_createStore(rootReducer,applyMiddleware(thunk,logger));
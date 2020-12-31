import {createStore, combineReducers, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
    auth: authReducer
});

export default createStore(rootReducer, applyMiddleware(promiseMiddleware));
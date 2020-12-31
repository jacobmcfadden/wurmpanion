// auth reducer
export const LOGIN_USER = {type: 'LOGIN_USER', error: {message: 'Login unsuccessful, credentials entered were invalid.', messageType: 'ErrorMessage'}, success: {message: 'GET_USER SUCCESS', messageType: 'SuccessMessage'}};
export const LOGOUT_USER = 'LOGOUT_USER';
export const GET_USER = {type: 'GET_USER', error: {message: 'Welcome, please login or signup.', messageType: 'SystemMessage'}, success: {message: 'GET_USER SUCCESS', messageType: 'SystemMessage'}};
export const REGISTER_USER = 'REGISTER_USER';
export const RECOVER_ACCOUNT = 'RECOVER_ACCOUNT';
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';
export const RESET_PASSWORD = 'RESET_PASSWORD';


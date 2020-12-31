import * as AxiosService from '../../services/AxiosService';
import {REGISTER_USER, LOGIN_USER, LOGOUT_USER, GET_USER, RECOVER_ACCOUNT, RESET_PASSWORD, SEND_EMAIL_CODE, SEND_PHONE_CODE, VERIFY_EMAIL, VERIFY_PHONE, SET_PHONE_SKIP, SET_IS_AUTHENTICATED, UPDATE_TWO_FACTOR_AUTH} from '../constants/types';

const initialState = {
    user: {},
    isLoggedIn: false,
    isAuthenticated: false,
    isEmailVerified: false,
    isPhoneVerified: false,
    isPhoneVerifySkip: false,
    isLoading: false
}

export function registerUser(firstName, lastName, phone, email, password) {
    return {
        type: REGISTER_USER,
        payload: AxiosService.registerUser(firstName, lastName, phone, email, password)
    }
}

export function loginUser(contact, password, code){
    return {
        type: LOGIN_USER.type,
        payload: AxiosService.loginUser(contact, password, code)
    }
}

export function logoutUser(){
    return {
        type: LOGOUT_USER,
        payload: AxiosService.logoutUser()
    }
}

export function getUser(){
    return {
        type: GET_USER.type,
        payload: AxiosService.getUser()
    }
}

export function recoverAccount(contact, firstContactCode, secondContactCode) {
    return {
        type: RECOVER_ACCOUNT,
        payload: AxiosService.recoverAccount(contact, firstContactCode, secondContactCode)
    }
}

export function resetPassword(password, contact) {
    return {
        type: RESET_PASSWORD,
        payload: AxiosService.resetPassword(password, contact)
    }
}

export function sendEmailCode(contact){
    return {
        type: SEND_EMAIL_CODE,
        payload: AxiosService.sendEmailCode(contact)
    }
}

export function sendPhoneCode(contact){
    return {
        type: SEND_PHONE_CODE,
        payload: AxiosService.sendPhoneCode(contact)
    }
}

export function verifyEmail(userInput, contact){
    return {
        type: VERIFY_EMAIL,
        payload: AxiosService.verifyEmail(userInput, contact)
    }
}

export function verifyPhone(userInput, contact){
    return {
        type: VERIFY_PHONE,
        payload: AxiosService.verifyPhone(userInput, contact)
    }
}

export function setPhoneSkip(){
    return {
        type: SET_PHONE_SKIP
    }
}

export function setIsAuthenticated(){
    return {
        type: SET_IS_AUTHENTICATED
    }
}

export function updateTwoFactorAuth(twoFactorAuth){
    return {
        type: UPDATE_TWO_FACTOR_AUTH,
        payload: AxiosService.updateTwoFactorAuth(twoFactorAuth)
    }
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_USER.type + "_PENDING":
            return {...state, isLoading: true};
        case GET_USER.type + "_FULFILLED":
            return {...state, isLoading: false, user: action.payload.data, isPhoneVerified: action.payload.data.isPhoneVerified, isEmailVerified: action.payload.data.isEmailVerified, isAuthenticated: action.payload.data.isAuthenticated, isTwoFactorAuth: action.payload.data.isTwoFactorAuth};
        case GET_USER.type + "_REJECTED":
            return {...state, isLoading: false};
        case LOGIN_USER.type + '_PENDING':
            return {...state, isLoading: true};
        case LOGIN_USER.type + '_FULFILLED':
            return {...state, isLoading: false, user: action.payload.data, isPhoneVerified: action.payload.data.isPhoneVerified, isEmailVerified: action.payload.data.isEmailVerified, isAuthenticated: action.payload.data.isAuthenticated, isTwoFactorAuth: action.payload.data.isTwoFactorAuth};
        case LOGIN_USER.type + '_REJECTED':
            return {...state, isLoading: false};
        case LOGOUT_USER + '_PENDING':
            return {...state, isLoading: true};
        case LOGOUT_USER + '_FULFILLED':
            return initialState;
        case LOGOUT_USER + '_REJECTED':
            return {...state, isLoading: false};
        case REGISTER_USER + '_PENDING':
            return {...state, isLoading: true};
        case REGISTER_USER + '_FULFILLED':
            return {...state, isLoading: false, user: action.payload.data, isPhoneVerified: action.payload.data.isPhoneVerified, isEmailVerified: action.payload.data.isEmailVerified, isAuthenticated: action.payload.data.isAuthenticated, isTwoFactorAuth: action.payload.data.isTwoFactorAuth};
        case REGISTER_USER + '_REJECTED':
            return {...state, isLoading: false};
        case RECOVER_ACCOUNT + '_PENDING':
            return {...state, isLoading: true};
        case RECOVER_ACCOUNT + '_FULFILLED':
            return {...state, isLoading: false};
        case RECOVER_ACCOUNT + '_REJECTED':
            return {...state, isLoading: false};
        case RESET_PASSWORD + '_PENDING':
            return {...state, isLoading: true};
        case RESET_PASSWORD + '_FULFILLED':
            return {...state, isLoading: false, user: action.payload.data, isPhoneVerified: action.payload.data.isPhoneVerified, isEmailVerified: action.payload.data.isEmailVerified, isAuthenticated: action.payload.data.isAuthenticated, isTwoFactorAuth: action.payload.data.isTwoFactorAuth};
        case RESET_PASSWORD + '_REJECTED':
            return {...state, isLoading: false};
        case UPDATE_TWO_FACTOR_AUTH + '_PENDING':
            return {...state, isLoading: true};
        case UPDATE_TWO_FACTOR_AUTH + '_FULFILLED':
            return {...state, isLoading: false, isTwoFactorAuth: action.payload.data.twoFactorAuth};
        case UPDATE_TWO_FACTOR_AUTH + '_REJECTED':
            return {...state, isLoading: false};
        case SEND_EMAIL_CODE + '_PENDING':
            return {...state, isLoading: true};
        case SEND_EMAIL_CODE + '_FULFILLED':
            return {...state, isLoading: false};
        case SEND_EMAIL_CODE + '_REJECTED':
            return {...state, isLoading: false};
        case SEND_PHONE_CODE + '_PENDING':
            return {...state, isLoading: true};
        case SEND_PHONE_CODE + '_FULFILLED':
            return {...state, isLoading: false};
        case SEND_PHONE_CODE + '_REJECTED':
            return {...state, isLoading: false};
        case VERIFY_PHONE + '_PENDING':
            return {...state, isLoading: true};
        case VERIFY_PHONE + '_FULFILLED':
            return {...state, isLoading: false, isPhoneVerified: action.payload.data.isPhoneVerified};
        case VERIFY_PHONE + '_REJECTED':
            return {...state, isLoading: false};
        case VERIFY_EMAIL + '_PENDING':
            return {...state, isLoading: true};
        case VERIFY_EMAIL + '_FULFILLED':
            return {...state, isLoading: false, isEmailVerified: action.payload.data.isEmailVerified};
        case VERIFY_EMAIL + '_REJECTED':
            return {...state, isLoading: false};
        case SET_PHONE_SKIP:
            return {...state, isPhoneVerifySkip: true};
        case SET_IS_AUTHENTICATED:
            return {...state, isAuthenticated: true};
            default:
            return state;
    }
}
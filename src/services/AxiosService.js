import axios from 'axios';

// AUTH CALLS
export function registerUser(firstName, lastName, phone, email, password) {
    return axios.post('/auth/register', {firstName, lastName, phone, email, password})
}

export function loginUser(contact, password, code){
    return axios.post('/auth/login', {contact, password, code})
}

export function logoutUser(){
    return axios.post('/auth/logout')
}

export function getUser(){
    return axios.get('/auth/user')
}

export function recoverAccount(contact, firstContactCode, secondContactCode){
    return axios.post('/auth/recover', {contact, firstContactCode, secondContactCode})
}

export function resetPassword(password, contact){
    return axios.put('/auth/reset', {password, contact})
}

// VERIFICATION CALLS
export function sendEmailCode(contact){
    return axios.post('/verify/email', {contact})
}

export function sendPhoneCode(contact){
    return axios.post('/verify/phone', {contact})
}

export function verifyEmail(userInput, contact){
    return axios.put('/verify/email', {userInput, contact})
}

export function verifyPhone(userInput, contact){
    return axios.put('/verify/phone', {userInput, contact})
}

export function updateTwoFactorAuth(twoFactorAuth){
    return axios.put('/auth/tfa', {twoFactorAuth})
}
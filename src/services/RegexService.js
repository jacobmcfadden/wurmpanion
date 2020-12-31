const phoneString = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const emailString = /.+@.+\..+/;
const pswString = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;
const nameString = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
const removeSpace = /^\s+/g;

export function validateInput(value, action) {
    if(action === 'phone') {
        const phoneReg = RegExp(phoneString);
        return phoneReg.test(value);
    } else if(action === 'email') {
        const emailReg = RegExp(emailString);
        return emailReg.test(value);
    } else if(action === 'password') {
        const pswReg = RegExp(pswString);
        return pswReg.test(value);
    } else if(action === 'firstName') {
        const firstNameReg = RegExp(nameString);
        return firstNameReg.test(value);
    } else if(action === 'lastName') {
        const lastNameReg = RegExp(nameString);
        return lastNameReg.test(value);
    } else {
        return false;
    }
}

export function formatInput(value, action) {
    if(action === 'phone') {
        return value.replace(phoneString, '($1) $2-$3');
    } else if(action === 'email') {
        return value.replace(removeSpace, '').toLowerCase();
    } else if(action === 'firstName') {
        return value.replace(removeSpace, '').charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    } else if(action === 'lastName') {
        return value.replace(removeSpace, '').replace(nameString, '$&');
    } else {
        return value;
    }
}
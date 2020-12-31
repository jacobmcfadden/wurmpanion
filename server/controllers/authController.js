const bcrypt = require('bcrypt');
const twilioClient = require('../twilioClient');
const nodemailerClient = require('../nodemailerClient');

module.exports = {
    login: async (req, res) => {
        const db = req.app.get('db');
        const {contact, password, code} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(401).send('You have entered invalid login credentials.');
        } else {
            const foundUser = bcrypt.compareSync(password, user[0].password);
            if(foundUser === true && user[0].two_factor_auth === true) {
                if(code) {
                    const datetime = new Date();
                    const today = datetime.toISOString().slice(0,10);
                    const codeResult = await db.auth.check_user_code([user[0].id, contact, today]);
                    if(!codeResult[0]) {
                        return res.status(404).send('No matching autherization codes found, please resubmit a code request.');
                    } else {
                        const authenticated = bcrypt.compareSync(code, codeResult[0].hash_string);
                        if(authenticated) {
                            req.session.user = {
                                id: user[0].id,
                                email: user[0].email,
                                firstName: user[0].first_name,
                                lastName: user[0].last_name,
                                phone: user[0].phone,
                                isAdmin: user[0].is_admin,
                                isEmailVerified: user[0].verify_email ? true : false,
                                isPhoneVerified: user[0].verify_phone ? true : false,
                                isAuthenticated: true,
                                isTwoFactorAuth: user[0].two_factor_auth
                            }
                            return res.status(200).send(req.session.user);
                        } else {
                            return res.status(401).send('That code didnt match our records, check your input and try again.');
                        }
                    }
                } else {
                    return res.status(409).send('Needs to submit two factor authentication code to login.');
                }
            } else if(foundUser === true && user[0].two_factor_auth === false){
                    req.session.user = {
                        id: user[0].id,
                        email: user[0].email,
                        firstName: user[0].first_name,
                        lastName: user[0].last_name,
                        phone: user[0].phone,
                        isAdmin: user[0].is_admin,
                        isEmailVerified: user[0].verify_email ? true : false,
                        isPhoneVerified: user[0].verify_phone ? true : false,
                        isAuthenticated: true,
                        isTwoFactorAuth: user[0].two_factor_auth
                    }
                    return res.status(200).send(req.session.user);
            } else {
                res.status(403).send('You have entered invalid login credentials.');
            }
        }
    },
    register: async (req, res) => {
        const db = req.app.get('db');
        const {firstName, lastName, email, password, phone} = req.body;
        const existingUser = await db.auth.check_user([email, phone]);
        if(existingUser[0]){
            return res.status(409).send('Email address or phone number linked to existing account.')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        const todayDate = (year + "-" + month + "-" + date);
        const isAdmin = false;
        const [newUser] = await db.auth.create_user([email, hash, firstName, lastName, phone, todayDate, isAdmin])
        req.session.user = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            phone: newUser.phone,
            isAdmin: newUser.is_admin,
            isEmailVerified: newUser.verify_email ? true : false,
            isPhoneVerified: newUser.verify_phone ? true : false,
            isAuthenticated: true,
            isTwoFactorAuth: newUser.two_factor_auth
        }
        res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send('You have been successfully logged out.');
    },
    getUser: async (req, res) => {
        if(req.session.user){
           return res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Logout failed.');
        }
    },
    recoverAccount: async (req, res) => {
        const db = req.app.get('db');
        const {contact, firstContactCode, secondContactCode} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(404).send('You have entered invalid account credentials.')
        } else {
            const datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            if(firstContactCode && secondContactCode) {
                const buf1 = Buffer.from(contact);
                const buf2 = Buffer.from(user[0].email);
                const isEmail = buf1.equals(buf2);
                if(isEmail === true) {
                    const firstContactResult = await db.auth.check_user_code([user[0].id, contact, today]);
                    const secondContactResult = await db.auth.check_user_code([user[0].id, user[0].phone, today]);
                    if(!firstContactResult[0] || !secondContactResult[0]) {
                        return res.status(404).send('No matching autherization codes found, please resubmit a code request.');
                    } else {
                        const firstCodeMatched = bcrypt.compareSync(firstContactCode, firstContactResult[0].hash_string);
                        const secondCodeMatched = bcrypt.compareSync(`${secondContactCode}`, secondContactResult[0].hash_string);
                        if(firstCodeMatched && secondCodeMatched) {
                            return res.status(200).send('User has passed recovery checks.');
                        }else {
                            return res.status(404).send('Code submitted did not match our records.');
                        }
                    }
                } else {
                    const firstContactResult = await db.auth.check_user_code([user[0].id, contact, today]);
                    const secondContactResult = await db.auth.check_user_code([user[0].id, user[0].email, today]);
                    if(!firstContactResult[0] || !secondContactResult[0]) {
                        return res.status(404).send('No matching autherization codes found, please resubmit a code request.');
                    } else {
                        const firstCodeMatched = bcrypt.compareSync(firstContactCode, firstContactResult[0].hash_string);
                        const secondCodeMatched = bcrypt.compareSync(secondContactCode, secondContactResult[0].hash_string);
                        if(firstCodeMatched && secondCodeMatched) {
                            return res.status(200).send('User has passed recovery checks.');
                        }else {
                            return res.status(404).send('Code submitted did not match our records.');
                        }
                    }
                }
            } else if(firstContactCode && !secondContactCode) {
                if(user[0].two_factor_auth === true) {
                    const datetime = new Date();
                    const today = datetime.toISOString().slice(0,10);
                    const firstContactResult = await db.auth.check_user_code([user[0].id, contact, today]);
                    if(!firstContactResult[0]) {
                        return res.status(404).send('No matching autherization codes found, please resubmit a code request.');
                    } else {
                        const firstCodeMatched = bcrypt.compareSync(firstContactCode, firstContactResult[0].hash_string);
                        if(firstCodeMatched) {
                            const endOfPhone = user[0].phone.substring(user[0].phone.length-2);
                            const phoneHint = 'xxx-xxx-xx' + endOfPhone;
                            const startOfEmail = user[0].email.substring(0,4);
                            const emailHint = startOfEmail + '***********';
                            const buf1 = Buffer.from(contact);
                            const buf2 = Buffer.from(user[0].email);
                            const isEmail = buf1.equals(buf2);
                            const numberTwoCode = Math.floor(100000 + Math.random() * 900000).toString();
                            // hash the generated code in prep to store in database
                            const salt = bcrypt.genSaltSync(10);
                            const hashed_code = bcrypt.hashSync(numberTwoCode, salt);   
                            if(isEmail === true) {
                                const verify_code = await db.auth.create_ver_code([hashed_code, today, !isEmail, user[0].phone, user[0].id]);
                                if(!verify_code[0]) {
                                    return res.status(500).send('Oh no! A problem occurred while trying to generate your code.');
                                } else {
                                    const userNumber = `1${user[0].phone.replace(/\D+/g, "")}`;
                                    const messageBody = `Credeology code: ${numberTwoCode}. Valid for 5 minutes`;
                                    const phoneSent = await twilioClient.sendSms(userNumber, messageBody);
                                    return res.status(403).send(phoneHint)
                                }
                            } else {
                                const verify_code = await db.auth.create_ver_code([hashed_code, today, isEmail, user[0].email, user[0].id]);
                                if(!verify_code[0]) {
                                    return res.status(500).send('Oh no! A problem occurred while trying to generate your code.');
                                } else {
                                    const messageBody = `Credeology code: ${numberTwoCode}. Valid for 5 minutes`;
                                    const subject = "Verification Code";
                                    const emailSent = await nodemailerClient.sendEmail(user[0].email, messageBody, subject);
                                    if(emailSent !== `Email was sent to ${user[0].email} sucessfully!`) {
                                        return res.status(500).send(emailSent);
                                    } else {
                                        return res.status(403).send(emailHint)
                                    }
                                }
                            }
                        }else {
                            return res.status(404).send('Code submitted did not match our records.');
                        }
                    }
                } else {
                    // CHECK FIRSTCONTACT CODE MATCH IN DB
                    const firstContactResult = await db.auth.check_user_code([user[0].id, contact, today]);
                    if(!firstContactResult[0]) {
                        return res.status(404).send('No matching autherization codes found, please resubmit a code request.');
                    } else {
                        const firstCodeMatched = bcrypt.compareSync(firstContactCode, firstContactResult[0].hash_string);
                        if(firstCodeMatched) {
                            return res.status(200).send('User has passed recovery checks.');
                        }else {
                            return res.status(404).send('Code submitted did not match our records.');
                        }
                    }
                }
            } else {
                const datetime = new Date();
                const today = datetime.toISOString().slice(0,10);
                // generate random 6 digit code
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                // hash the generated code in prep to store in database
                const salt = bcrypt.genSaltSync(10);
                const hashed_code = bcrypt.hashSync(code, salt);
                const buf1 = Buffer.from(contact);
                const buf2 = Buffer.from(user[0].email);
                const isEmail = buf1.equals(buf2);
                // Add the saved code to the database
                const verify_code = await db.auth.create_ver_code([hashed_code, today, isEmail, contact, user[0].id]);
                // send the verification code
                if(!verify_code[0]) {
                    return res.status(304).send('Oh no! A problem occurred while trying to generate your code.');
                } else {
                    if(isEmail === true) {
                        const messageBody = `Credeology code: ${code}. Valid for 5 minutes`;
                        const subject = "Verification Code";
                        const emailSent = await nodemailerClient.sendEmail(user[0].email, messageBody, subject);
                        if(emailSent !== `Email was sent to ${user[0].email} sucessfully!`) {
                            return res.status(500).send(emailSent);
                        } else {
                            return res.status(401).send('Account was found and code was sent')
                        }
                    } else {
                        const userNumber = `1${user[0].phone.replace(/\D+/g, "")}`;
                        const messageBody = `Credeology code: ${code}. Valid for 5 minutes`;
                        const phoneSent = await twilioClient.sendSms(userNumber, messageBody);
                        return res.status(401).send('Account was found and code was sent')
                    }
                }
            }
        }
    },
    resetPassword: async (req, res) => {
        const db = req.app.get('db');
        const {password, contact} = req.body;
        const existingUser = await db.auth.find_user(contact);
        if(!existingUser[0]){
            return res.status(401).send('Problem Finding your account, please contact support.')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        const todayDate = (year + "-" + month + "-" + date);
        const updatedUser = await db.auth.reset_user_password(existingUser[0].id, hash, todayDate)
        if(updatedUser[0]){
        req.session.user = {...req.session.user,
            id: updatedUser[0].id,
            email: updatedUser[0].email,
            firstName: updatedUser[0].first_name,
            lastName: updatedUser[0].last_name,
            phone: updatedUser[0].phone,
            isAdmin: updatedUser[0].is_admin,
            isEmailVerified: updatedUser[0].verify_email ? true : false,
            isPhoneVerified: updatedUser[0].verify_phone ? true : false,
            isAuthenticated: true,
            isTwoFactorAuth: updatedUser[0].two_factor_auth
        }
            return res.status(200).send(req.session.user)
        } else {
            return res.status(409).send('Problem resetting your account password, please contact support.')
        }
    },
    sendEmailCode: async (req, res) => {
        const db = req.app.get('db');
        const {contact} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(401).send('You have entered invalid login credentials.');
        } else {        
            // create code timestamp
            const datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            // generate random 6 digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            // hash the generated code in prep to store in database
            const salt = bcrypt.genSaltSync(10);
            const hashed_code = bcrypt.hashSync(code, salt);
            // Add the saved code to the database
            const verify_code = await db.auth.create_ver_code([hashed_code, today, true, user[0].email, user[0].id]);
            // send the verification code
            if(!verify_code[0]) {
                return res.status(304).send('Oh no! A problem occurred while trying to generate your code.');
            } else {
                const messageBody = `Credeology code: ${code}. Valid for 5 minutes`;
                const subject = "Verification Code";
                const sendVer = await nodemailerClient.sendEmail(user[0].email, messageBody, subject);
                if(sendVer !== `Email was sent to ${user[0].email} sucessfully!`) {
                    return res.status(550).send(sendVer);
                } else {
                    res.status(200).send(sendVer);
                }
            }
        }
    },
    sendPhoneCode: async (req, res) => {
        const db = req.app.get('db');
        const {contact} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(401).send('You have entered invalid login credentials.');
        } else {
            // create code timestamp
            const datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            // generate random 6 digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            // hash the generated code in prep to store in database
            const salt = bcrypt.genSaltSync(10);
            const hashed_code = bcrypt.hashSync(code, salt);
            // Add the saved code to the database
            const verify_code = await db.auth.create_ver_code([hashed_code, today, false, user[0].phone, user[0].id]);
            // send the verification code
            if(!verify_code[0]) {
                return res.status(304).send('Oh no! A problem occurred while trying to generate your code.');
            } else {
                const userNumber = `1${user[0].phone.replace(/\D+/g, "")}`;
                const messageBody = `Credeology code: ${code}. Valid for 5 minutes`;
                const sendVer = await twilioClient.sendSms(userNumber, messageBody);
                res.status(200).send(`Code Message Sent to ${user[0].phone}`);
            }
        }
    },
    verifyEmail: async (req, res) => {
        const db = req.app.get('db');
        const {userInput, contact} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(401).send('You have entered invalid login credentials.');
        } else {        
            const datetime = new Date();
            const today = datetime.toISOString().slice(0,10);

            const codes = await db.auth.check_user_code([user[0].id, user[0].email, today]);
            if(!codes[0]) {
                return res.status(404).send('No active email verification codes, please resubmit a code request.');
            } else {
                const authenticated = bcrypt.compareSync(userInput, codes[0].hash_string);
                if(authenticated) {
                    const codeVerified = await db.auth.update_user_verified_email([user[0].id, today]);
                    if(!codeVerified[0]) {
                        return res.status(304).send('Oh no! A problem occurred during update.');
                    } else {
                        req.session.user = {...req.session.user,
                            isEmailVerified: codeVerified[0].verify_email ? true : false
                        }
                        return res.status(200).send(req.session.user)
                    }
                } else {
                    res.status(401).send('That code didnt match our records, check your input and try again.');
                }
            }
        }
    },
    verifyPhone: async (req, res) => {
        const db = req.app.get('db');
        const {userInput, contact} = req.body;
        const user = await db.auth.find_user([contact]);
        if(!user[0]) {
            return res.status(401).send('You have entered invalid login credentials.');
        } else {
            const datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            const codes = await db.auth.check_user_code([user[0].id, user[0].phone, today]);
            if(!codes[0]) {
                return res.status(404).send('No active text verification codes, please resubmit a code request.');
            } else {
                const authenticated = bcrypt.compareSync(userInput, codes[0].hash_string);
                if(authenticated) {
                    const codeVerified = await db.auth.update_user_verified_phone([user[0].id, today]);
                    if(!codeVerified[0]) {
                        return res.status(304).send('Oh no! A problem occurred during update.');
                    } else {
                        req.session.user = {...req.session.user,
                            isPhoneVerified: codeVerified[0].verify_email ? true : false
                        }
                        return res.status(200).send(req.session.user)
                    }
                } else {
                    res.status(401).send('That code didnt match our records, check your input and try again.');
                }
            }
        }
    },
    verifyOrganization: async (req, res) => {
        const {userInputName, userInputNumber} = req.body;
        const nameSearch = `DATA_GOV_URL like '%25${userInputName}%25'`;
        const numberSearch = `DATA_GOV_2'${userInputNumber}'`;
        const soda = require('soda-js');
        const consumer = new soda.Consumer('EXPLORE_DATA_GOV');

        consumer.query()
        .withDataset('GOV_DATASET')
        .limit(20)
        .where({ namelast: 'SMITH' })
        .order('namelast')
        .getRows()
            .on('success', function(rows) { console.log(rows); })
            .on('error', function(error) { console.error(error); });
    },
    updateTwoFactorAuth: async (req, res) => {
        const db = req.app.get('db');
        const {twoFactorAuth} = req.body;
        const {id} = req.session.user;
        const datetime = new Date();
        const today = datetime.toISOString().slice(0,10);
        const [updatedUser] = await db.auth.update_user_two_factor_auth([id, today, twoFactorAuth]);
        if(!updatedUser) {
            return res.status(304).send('Oh no! A problem occurred during update.');
        } else {
            req.session.user = {...req.session.user,
                twoFactorAuth: updatedUser.two_factor_auth
            }
            return res.status(200).send(req.session.user)
        }
    }
}
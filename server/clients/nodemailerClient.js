const nodemailer = require("nodemailer");
require('dotenv');

const {EMAIL_ACCOUNT, EMAIL_PASS, VERIFY_ACCOUNT}=process.env;

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendEmail = async function(email, link, subject) {
  // Generate test SMTP service account from ethereal.email

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: EMAIL_ACCOUNT, // generated ethereal user
      pass: EMAIL_PASS // generated ethereal password
    }
  });
  
  // send mail with defined transport object
  return transporter.sendMail({
    from: VERIFY_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: link, // plain text body
    html: `<b>${link}</b>` // html body
  }).then(() => {
     return `Email was sent to ${email} sucessfully!`; 
  }).catch((err) => {
     return err;
  });
};
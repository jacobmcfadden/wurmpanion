const config = require('./config/config');

module.exports.sendSms = async function(to, message) {
  const client = require('twilio')(config.accountSid, config.authToken);
  return client.api.messages
    .create({
      body: message,
      to: to,
      from: config.sendingNumber,
    }).then(function(data) {
      console.log('User notified');
    }).catch(function(err) {
      console.error('Could not notify user');
      console.error(err);
    });
};
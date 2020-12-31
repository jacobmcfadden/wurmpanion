const twilioClient = require('../twilioClient');
const admins = require('../config/administrators.json');
// IF YOU ARE MISSING ADMINS IT IS BECAUSE OF GITIGNORE
function formatMessage(errorToReport) {
  return '[This is a test] ALERT! It appears the server is' +
    'having issues. Exception: ' + errorToReport;
};

exports.notifyOnError = function(appError, request, response, next) {
  admins.forEach(function(admin) {
    const messageToSend = formatMessage(appError.message);
    twilioClient.sendSms(admin.phoneNumber, messageToSend);
  });
  next(appError);
};
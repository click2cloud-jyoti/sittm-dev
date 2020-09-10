const nodemailer = require('nodemailer');
//const crypto = require('crypto');
// 0fbc71e762dc80b5806042564b4fa60d
//var mykey = crypto.createDecipher('aes-128-cbc', 'qwertyuiop');
//var mystr = mykey.update('2b51794c5ac74635e03806b74bf9ff6d', 'hex', 'utf8')
//mystr += mykey.final('utf8');

const transporter = nodemailer.createTransport({
    // host: "smtp.office365.com", 
    host: "smtp-mail.outlook.com", 
    secureConnection: false, 
    port: 587, 
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'cloudbrain-support@click2cloud.net',
        // user: 'v-rogavf@microsoft.com', 
        pass: 'CLICK@CLOUD@8999506387'
    }
});

function sendMail(body, callback, callbackerr) {

    transporter.sendMail(body, function (error, info) {
        if (error) {
            callbackerr(error);
        }
        callback(info);
    });
}
exports.sendMail = sendMail;
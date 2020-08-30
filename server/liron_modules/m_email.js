const nodemailer = require('nodemailer');
const config = require('./m_config');

module.exports = {
    sendEmail: (senderName, senderEmail, subject, msg) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.get_support_email(),
                pass: config.get_email_pass()
            }
        });

        let mailOptions = {
            from: config.get_support_email(),
            to: config.get_email(),
            subject: subject,
            text: `This email send using site contact option\n` +
                `Contact Name: ${senderName}\n` +
                 `Contact Email: ${senderEmail}\n` +
                'With the fallowing message:\n\n' +
                msg
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
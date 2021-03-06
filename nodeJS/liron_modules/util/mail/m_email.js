const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: (senderName, senderEmail, subject, msg) => {
        let email = process.env.EMAIL;
        let supportEmail = process.env.SUPPORT_EMAIL;
        let psw = process.env.EMAIL_PASS;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: supportEmail,
                pass: psw
            }
        });

        let mailOptions = {
            from: supportEmail,
            to: email,
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
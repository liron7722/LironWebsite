const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: (senderName, senderEmail, subject, msg) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.SUPPORT_EMAIL,
            to: process.env.EMAIL,
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
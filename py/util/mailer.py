import smtplib
from os import environ

psw = environ.get('EMAIL_PASS')
receiverEmail = environ.get('EMAIL')
senderEmail = environ.get('SUPPORT_EMAIL')


def sendEmail(msg, logger):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:  # start a connection with mail
        smtp.ehlo()  # identify my self
        smtp.starttls()  # secure connection
        smtp.ehlo()  # re identify my self after secure connection
        smtp.login(senderEmail, psw)  # email login
        smtp.sendmail(senderEmail, receiverEmail, msg)
        logger.info(f'Email send to {receiverEmail}')
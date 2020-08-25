from os import environ, sep
import smtplib
import requests
from .path import getPath
from .logger import Logger

timeout = 5
localHost = '127.0.0.1'
websiteName = "lironrevah.tech"
psw = environ.get('EMAIL_PASS')
receiverEmail = environ.get('EMAIL')
senderEmail = environ.get('SUPPORT_EMAIL')
port = environ.get('NODE_PORT')
serverType = environ.get('NODE_ENV')
logsPath = getPath(N=2) + f'logs{sep}'
logger = Logger('monitor.log', logsPath).getLogger()


def sendEmail(local="Down", domain="Down"):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:  # start a connection with mail
        smtp.ehlo()  # identify my self
        smtp.starttls()  # secure connection
        smtp.ehlo()  # re identify my self after secure connection

        smtp.login(senderEmail, psw)  # email login

        subject = f"{websiteName} website is Down!"  # email subject
        body = 'This is the server status:\n' \
               f'\tLocal check: {local}\n' \
               f'\tDomain check: {domain}\n\n'\
               'Make sure the server restarted and it is back up'  # email body message
        msg = f'Subject: {subject}\n\n{body}'  # email message format

        smtp.sendmail(senderEmail, receiverEmail, msg)


try:
    rLocal = requests.get(f"{localHost}:{port}", timeout=timeout)
    rDomain = requests.get(websiteName, timeout=timeout)
    if rLocal.status_code != 200:  # check for bad local connection
        sendEmail()
    elif rDomain.status_code != 200:  # check for bad domain connection
        sendEmail(local="UP")
except requests.ConnectionError as e:
    message = "Got ConnectionError while trying to monitor website"
    logger.e(message)
except requests.Timeout as e:
    message = "Got Timeout while trying to monitor website"
    logger.e(message)

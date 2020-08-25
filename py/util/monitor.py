# -*- coding: utf-8 -*-
import smtplib
import requests
from os import environ, sep
from py.util.path import getPath
from py.util.logger import Logger

timeout = 5
url = "http://localhost"
websiteName = 'http://lironrevah.tech'
psw = environ.get('EMAIL_PASS')
receiverEmail = environ.get('EMAIL')
senderEmail = environ.get('SUPPORT_EMAIL')
port = environ.get('NODE_PORT')
serverType = environ.get('NODE_ENV')
logsPath = getPath(N=0) + f'logs{sep}'
logger = Logger('monitor.log', logsPath).getLogger()


def sendEmail(code):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:  # start a connection with mail
        smtp.ehlo()  # identify my self
        smtp.starttls()  # secure connection
        smtp.ehlo()  # re identify my self after secure connection

        smtp.login(senderEmail, psw)  # email login

        subject = f"{websiteName} website is Down!"  # email subject
        body = 'This is the server status:\n' \
               f'\tStatus code: {code}\n\n' \
               'Make sure the server restarted and it is back up'  # email body message
        msg = f'Subject: {subject}\n\n{body}'  # email message format

        smtp.sendmail(senderEmail, receiverEmail, msg)


try:
    r = requests.get(f"{url}:{port}", timeout=timeout)
    if r.status_code != 200:  # check for bad local connection
        sendEmail(r.status_code)
    else:
        logger.info("Check went ok")
except requests.Timeout as e:
    message = "Got Timeout while trying to monitor website"
    logger.error(message, e)
except requests.ConnectionError as e:
    message = "Got ConnectionError while trying to monitor website"
    logger.error(message, e)

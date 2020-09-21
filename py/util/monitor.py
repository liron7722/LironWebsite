# -*- coding: utf-8 -*-
import requests
from os import environ, sep
from py.util.path import getPath
from py.util.logger import Logger
from py.util.time import callSleep
from py.util.mailer import sendEmail

TIMEOUT = 5
url = "https://localhost"
websiteName = 'https://lironrevah.tech'
port = environ.get('NODE_PORT')
serverType = environ.get('NODE_ENV')
logsPath = getPath(N=1) + f'logs{sep}'
logger = Logger('monitor.log', logsPath).getLogger()


def setMessage(code, logMsg=None, status='Down'):
    extra = f'Message: {logMsg}\n\n' if logMsg is not None else ''
    subject = f"{websiteName} website is {status}!"  # email subject
    body = f'Server type: {serverType}\n'\
           f'Status code: {code}\n{extra}'  # email body message
    msg = f'Subject: {subject}\n\n{body}'  # email message format
    return msg


def setErrorMessage(code, logMsg):
    msg = setMessage(code, logMsg)
    sendEmail(msg, logger)
    return True


def checkWebsite(CF):
    r = {'status_code': 500}
    try:
        r = requests.get(f"{url}:{port}", timeout=TIMEOUT)
        if 200 <= r.status_code < 400:  # check for bad local connection
            CF = setErrorMessage(r.status_code, setMessage(r.status_code))
        else:
            logger.info("Check went ok")
            if CF:
                sendEmail(setMessage(200, logMsg=None, status='UP'), logger)  # startup message
                CF = False
    except requests.Timeout as _:
        logMsg = f"Got Timeout while trying to monitor {websiteName}\n\n" \
                 "Make sure the server restarted and it is back up"
        CF = setErrorMessage(r.status_code, logMsg)
    except requests.ConnectionError as _:
        logMsg = f"Got ConnectionError while trying to monitor {websiteName}\n\n" \
                 "Make sure the server restarted and it is back up"
        CF = setErrorMessage(r.status_code, logMsg)
    finally:
        callSleep(logger, minutes=30) if CF else callSleep(logger, hours=1)
        return CF


if __name__ == '__main__':
    sendEmail(setMessage('***', logMsg='Check in few seconds', status='Booting Up'), logger)  # startup message
    callSleep(logger, minutes=1)
    CrashFlag = True
    while True:
        CrashFlag = checkWebsite(CrashFlag)

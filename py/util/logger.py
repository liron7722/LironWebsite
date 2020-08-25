import logging
import logging.handlers
from .path import createDir


class Logger:

    def __init__(self, logName='NoName.log', logPath='', logger=None):
        createDir(logPath)
        self.logger = self.startLogger(logName, logPath, logger)

    def getLogger(self):
        return self.logger

    # input - logName as string, logPath as string, logger as logging class
    # output - logger as logging class
    # do - set logger settings
    @staticmethod
    def startLogger(logName, logPath, logger=None):
        newLogger = logging.getLogger(logName) if logger is None else logger

        newLogger.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(module)s: %(message)s', datefmt='%d-%m-%Y %H-%M-%S')

        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)

        file_handler = logging.handlers.RotatingFileHandler(logPath + logName, maxBytes=10485760, backupCount=10)
        file_handler.setFormatter(formatter)

        newLogger.addHandler(file_handler)
        newLogger.addHandler(stream_handler)

        newLogger.info('Initialize Log')
        return newLogger

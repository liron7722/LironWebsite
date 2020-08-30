from os import environ
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

LOCAL_DB_URI = environ.get('MONGO_DB_LOCAL_URI')
CLOUD_DB_URI = environ.get('MONGO_DB_CLOUD_URI')


class DB:
    dbNames = ['home']  # database names

    def __init__(self, preference='cloud', logger=None):
        self.logger = logger
        self.preference = preference
        self.clients = {'cloud': MongoClient(CLOUD_DB_URI), 'local': MongoClient(LOCAL_DB_URI)}
        self.dbConnections = self.setConnections()

    def setConnections(self):
        dbConnections = {}
        for client in self.clients.keys():
            connections = {}
            for name in self.dbNames:
                try:
                    connections[name] = self.clients[client].get_database(name)
                    self.log(f'{client} db establish connection to {name}')
                except ServerSelectionTimeoutError as _:
                    message = 'db connection Timeout - check for if this machine ip is on whitelist'
                    if self.logger is not None:
                        self.logger.exception(message)
                    else:
                        print(message)
            dbConnections[client] = connections
        return dbConnections

    def getDBConnections(self):
        return self.dbConnections

    def log(self, message):
        if self.logger is not None:
            self.logger.debug(message)
        else:
            print(message)


import json
import pprint
from os import sep


fileNames = ['projects', 'upcoming']
path = f'C:{sep}Users{sep}Liron{sep}Documents{sep}GitHub{sep}LironWebsite{sep}'
A = DB()
clients = A.getDBConnections()
pprint.pprint(clients)
#for file in fileNames:
#    filePath = path + file + '.json'
#    with open(filePath, encoding='utf8') as json_file:
#        data = json.load(json_file)
#        for key in clients:
#            collection = clients[key]['home'].get_collection(file)
#            for item in data:
#                collection.insert_one(item)
print(LOCAL_DB_URI)
import sys
from py.util.monitor import run as website_monitor

if __name__ == '__main__':
    functions = {
                1: website_monitor
                 }
    if len(sys.argv) > 1:
        choice = int(sys.argv[1])

    else:
        choice = int(input("Enter which function you want to run:\n"
                           "1: Website Monitor\n"
                           ))
    if len(functions) >= choice > 0:
        func = functions[choice]
        func()

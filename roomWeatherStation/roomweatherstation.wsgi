import os, sys

PROJECT_DIR = '/var/www/roomWeatherStation'

activate_this = os.path.join(PROJECT_DIR, 'roomWeatherStation/venv/bin/activate_this.py')

with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

sys.path.insert(0, PROJECT_DIR)

from roomWeatherStation import app as application

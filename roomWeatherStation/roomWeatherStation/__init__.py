from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify, render_template, request
from datetime import datetime as dt
import serial
import atexit
import json
import os


def get_serial():
    with serial.Serial('/dev/ttyUSB0') as ser:
        try:
            ser.isOpen();
        except:
            ser.close()
            ser.open()
        if not os.path.exists(csv_file_path):
            with open(csv_file_path, 'a', encoding='utf8') as csv_file:
                csv_file.write('time,h,t,ppm,heat_index\n')
        time = dt.now().strftime('%Y-%m-%d %H:%M:%S')
        h, t, ppm, heat_index = ser.readline().decode(encoding='utf8').strip().split(',')
        with open(csv_file_path, 'a', encoding='utf8') as csv_file:
            csv_file.write('{},{},{},{},{}\n'.format(time, h, t, ppm, heat_index))

    return h, t, ppm, heat_index


sched = BackgroundScheduler(deamon=True)
sched.add_job(get_serial, 'interval', seconds=60)
sched.start()

app = Flask(__name__)

csv_file_path='h_t_ppm.csv'


@app.route('/')
def index():
    return render_template('index.html', **locals())


@app.route('/_get_sensors_values')
def _get_sensors_values():
    lines = request.args.get('count', 60, type=int)
    with open(csv_file_path) as csv_file:
        values_lines = csv_file.readlines()[-lines:]
    time_values = []
    humidity_values = []
    temp_values = []
    ppm_values = []
    heat_index_values = []

    for line in values_lines:
        try:
            time, h, t, ppm, heat_index = line.strip().split(',')
            if ppm.isdigit():
                time_values.append(time)
                humidity_values.append(h)
                temp_values.append(t)
                ppm_values.append(ppm)
                heat_index_values.append(heat_index)
        except:
            pass
        
    values = {
            'time_values': time_values,
            'humidity_values': humidity_values,
            'temp_values': temp_values,
            'ppm_values': ppm_values,
            'heat_index_values': heat_index_values,
            }


    return jsonify(values)


if __name__ == "__main__":
    app.run()

from flask import Flask, jsonify, render_template, request
from sqlalchemy import and_
import atexit
import json
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'h_t_ppm.db')

from . import background_scheduler
from .db_models import Record, db

@app.route('/')
def index():
    return render_template('index.html', **locals())


@app.route('/_get_sensors_values')
def _get_sensors_values():
    lines = request.args.get('count', 60, type=int)
    date_from = request.args.get('date_from', None, type=str)
    date_to = request.args.get('date_to', None, type=str)

    if date_from and date_to:
        date_from = datetime.strptime(date_from, '%m/%d/%Y %H:%M %p')
        date_to = datetime.strptime(date_to, '%m/%d/%Y %H:%M %p')
        values = Record.query.filter(and_(date_from < Record.date, Record.date < date_to)).limit(lines).all()
    else:
        values = list(reversed(Record.query.order_by(-Record.id).limit(lines).all()))

    time_values = [val.date for val in values]
    humidity_values = [val.humidity for val in values]
    temp_values = [val.temperature for val in values]
    ppm_values = [val.ppm for val in values]
    heat_index_values = [val.heat_index for val in values]

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

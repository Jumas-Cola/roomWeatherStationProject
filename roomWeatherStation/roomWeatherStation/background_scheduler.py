from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime as dt
import serial
import os

from .db_models import Record, db


def get_serial():
    with serial.Serial('/dev/ttyUSB0') as ser:
        try:
            ser.isOpen();
        except:
            ser.close()
            ser.open()

        h, t, ppm, heat_index = ser.readline().decode(encoding='utf8').strip().split(',')

        record = Record(humidity=int(float(h)), temperature=float(t), ppm=int(ppm), heat_index=float(heat_index))
        db.session.add(record)
        db.session.commit()

    return h, t, ppm, heat_index


sched = BackgroundScheduler(deamon=True)
sched.add_job(get_serial, 'interval', seconds=60)
sched.start()



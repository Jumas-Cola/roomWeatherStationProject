from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from roomWeatherStation import app

db = SQLAlchemy(app)

class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False,
            default=datetime.now)
    humidity = db.Column(db.Integer, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    ppm = db.Column(db.Integer, nullable=False)
    heat_index = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return '<Record date:{}, h:{}, t:{}, ppm:{}>'.format(self.date, self.humidity, self.temperature, self.ppm)

db.create_all()

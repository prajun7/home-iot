import os
import psycopg2
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import requests
import numpy as np
#from config import config
# environment name = iot

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://Team4:Team4@138.26.48.83:5432/Team4DB"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db=SQLAlchemy(app)
Migrate(app,db)

conn = psycopg2.connect(
    host="138.26.48.83",
    database="Team4DB",
    user="Team4",
    password="Team4")
cursor = conn.cursor()


def create_tables():
    #create tables in the PostgreSQL database
    cursor.execute('''INSERT INTO Thermostat(thermostat_id, thermostat_name, temp_reading)
     VALUES (1, 'internal', 75)''')

    cursor.close()
    conn.commit()  
    print("Table thermostat created successfully in PostgreSQL ")

"""
def create_tables():
    #create tables in the PostgreSQL database
    cursor.execute('''CREATE TABLE Thermostat
       (thermostat_id serial PRIMARY KEY,
       thermostat_name text NOT NULL,
       temp_reading real NOT NULL);''')

    cursor.close()
    conn.commit()  
    print("Table thermostat created successfully in PostgreSQL ")
"""
if __name__ == '__main__':
    create_tables()
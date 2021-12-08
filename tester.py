"""
Program used to test implementations and to make sure they are working properly.
"""

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

def fetch_electricUsage():
    cursor.execute("SELECT SUM(usage) FROM electric2")
    a = cursor.fetchall()[0][0]
    return a/2

def fetch_electricCost():
    cursor.execute("SELECT SUM(cost) FROM electric2")
    return cursor.fetchall()[0][0]

#print(fetch_electricUsage())
#print(fetch_electricCost())

def toggle_item(dataTable, state, id):
    cursor.execute( "SELECT " + state + " FROM " + dataTable  + " WHERE id = " + id)
    result = cursor.fetchone()[0]
    if result == True:
        bool = str(False)
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    elif result == False:
        bool = str(True)
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    cursor.execute(update)
    conn.commit()
    print(cursor.rowcount, "record(s) affected")
##toggle_item("doors", "isopen", "2")

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if request.form.get('action1') == 'VALUE1':
            toggle_item("doors", "isopen", "2")
        elif  request.form.get('action2') == 'VALUE2':
            toggle_item("doors", "isopen", "2")
        else:
            pass # unknown
    elif request.method == 'GET':
        return render_template('index.html')

    return render_template("index.html")

def CtoF(c):
    f = (c * 1.8) + 32
    return f
def get_currentWeather():
    now = datetime.now()

    start = now.strftime("%Y-%m-%d")
    end = now.strftime("%Y-%m-%d" )
    time = now.strftime("%H")
    timeInt = int(time)
    tz = "America/Chicago"
    url = "https://meteostat.p.rapidapi.com/stations/hourly"

    querystring = { "station": '10637', "start": start, "end": end, "tz": tz }
    headers ={
        #'x-rapidapi-host': 'meteostat.p.rapidapi.com',
        #'x-rapidapi-key': 'ecedde975bmshd68d593407c0634p1e90c2jsn8f1f0f5c5e2d'
        'x-rapidapi-host': "meteostat.p.rapidapi.com",
        'x-rapidapi-key': "8a4e4f6fa6msh31a22a7d4173d98p1d34e0jsn6342ce15ae0c"
    }
    #print(timeInt)
    response = requests.request("GET", url, headers=headers, params=querystring)
    externalTemp = response.json()["data"][timeInt]['temp']
    return CtoF(externalTemp)

#a = get_currentWeather()
#print(a)

## method dedicated to read file and split unnessary space
"""
def textRead(fn):
    dict = {}
    f = open(fn, 'r')
    for line in f:
        (dayNumber, day, item, time, cost) = line.split() 
        tupleName = (day, item, time, cost)
    return tupleName

data = textRead("electric.txt")
data = textRead("waterheater.txt")

list = open("electric.txt").read().splitlines()
list2 = open("waterheater.txt").read().splitlines()
print(list)
"""

def read_file(a_file):
    a_file = open(a_file, "r")
    list_of_lists = []
    for line in a_file:
        stripped_line = line.strip()
        line_list = stripped_line.split()
        list_of_lists.append(line_list)

    a_file.close()
#    print (list_of_lists)
    return list_of_lists
a = read_file("electric.txt")
b = read_file("water.txt")
c = read_file("heater.txt")

def get_itemIndex(list, index):
    list2 = []
    for i in range(len(list)):
        list2.append(i)
#        return list[i][index]
        print(list2)
#get_itemIndex(a, 2)

#electron = read_file("electric.txt")
#print(electron)
#item = electron[1][1]
#print(item)
#eC = get_itemIndex(electron, 1)
#print(eC)
#i = eC[0]
#print(i)
#print(get_currentWeather())

def toggle_light(column, value):
    cursor.execute( "SELECT " + column + " from electric2 WHERE id = 1")
    result = cursor.fetchone()[0]
    changeValue = result + value
    strChangeValue = str(changeValue)
    update = "UPDATE electric2 SET " + column + " = " + strChangeValue + " WHERE id =  1"
    cursor.execute(update)
    #conn.commit()

def toggle_electric(dataTable, state, id):
    cursor.execute( "SELECT " + state + " FROM " + dataTable  + " WHERE id = " + id)
    result = cursor.fetchone()[0]
    if result == True:
        bool = str(False)
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    elif result == False:
        print(result)
        bool = str(True)
        toggle_light("cost", 0.12)  #cost ## This is done twice to add .12 to the cost
        toggle_light("hourson", 1) #hours on

        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    cursor.execute(update)
    conn.commit()



#(toggle_electric("electric2", "hourson", "1", 1)) #increase hours on
#(toggle_electric("electric2", "cost", "1", .12 )) #increase cost

toggle_electric("electric", "ison", "1")
"""
if __name__ == '__main__':
    app.run(debug=True)
    conn.close()
"""

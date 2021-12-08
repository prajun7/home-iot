import os
import psycopg2
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import requests
from datetime import datetime
import random


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

def CtoF(c):
    f = (c * 1.8) + 32
    return f

def get_currentWeather():
    now = datetime.now()

    start = now.strftime("%Y-%m-%d")
    end = now.strftime("%Y-%m-%d" )
    time = now.strftime("%H")
    timeInt = int(time)
    tz = "America/Chicago" # Alternate timezone "Africa/Cairo"
    url = "https://meteostat.p.rapidapi.com/stations/hourly"

    querystring = { "station": '10637', "start": start, "end": end, "tz": tz }
    headers ={
        #'x-rapidapi-host': 'meteostat.p.rapidapi.com',  --no longer works
        #'x-rapidapi-key': 'ecedde975bmshd68d593407c0634p1e90c2jsn8f1f0f5c5e2d'


        'x-rapidapi-host': "meteostat.p.rapidapi.com",
        'x-rapidapi-key': "8a4e4f6fa6msh31a22a7d4173d98p1d34e0jsn6342ce15ae0c"

        #'x-rapidapi-host': "meteostat.p.rapidapi.com",                              #Sharman Malhi API Key 
        #'x-rapidapi-key': "ba7697464emsh40cabed91c904ebp10950ejsnd4c049376a27"      #For presentation or backup


    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    externalTemp = response.json()['data'][timeInt]['temp']

    return CtoF(externalTemp)

def get_internal_temp():
    cursor.execute("SELECT temp_reading FROM Thermostat")
    return cursor.fetchone()[0]

def read_file(a_file):
    a_file = open(a_file, "r")
    list_of_lists = []
    for line in a_file:
        stripped_line = line.strip()
        line_list = stripped_line.split()
        list_of_lists.append(line_list)
    a_file.close()
    return list_of_lists

def get_itemIndex(list, index):
    
    for i in range(len(list)):
        return list[i][index]
        #print(list[i][index])

def fetch_electricUsage():
    cursor.execute("SELECT SUM(usage) FROM electric2")
    a = cursor.fetchall()[0][0]
    return a/2
def fetch_electricCost():
    cursor.execute("SELECT SUM(cost) FROM electric2")
    a = cursor.fetchall()[0][0]
    return a/2
def fetch_waterCost():
    cursor.execute("SELECT SUM(cost) FROM water")
    a = cursor.fetchall()[0][0]
    return a/2
def fetch_waterUsage():
    cursor.execute("SELECT SUM(gallons) FROM water")
    a = cursor.fetchall()[0][0]
    return a/2
def fetch_heaterUsage():
    cursor.execute("SELECT SUM(cost) FROM hwheater")
    a = cursor.fetchall()[0][0]
    return a/2
"""    
def fetch_heaterUsage():
    cursor.execute("SELECT SUM(usage) FROM hwheater")
    a = cursor.fetchall()[0][0]
    return a/2
"""
def fetch_heaterCost():
    cursor.execute("SELECT SUM(cost) FROM hwheater")
    a = cursor.fetchall()[0][0]
    return a/2

def toggle_item(dataTable, state, id):
    cursor.execute( "SELECT " + state + " FROM " + dataTable  + " WHERE id = " + id)
    result = cursor.fetchone()[0]
    if result == True:
        bool = str(False)
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    elif result == False:
        print(result)
        bool = str(True)
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    cursor.execute(update)
    conn.commit()
    ##print(cursor.rowcount, "record(s) affected")


## function that toggles the temperature of the internal thermostat depending on the door toggles
def toggle_thermostat(dataTable, state, id):
    cursor.execute( "SELECT " + state + " FROM " + dataTable  + " WHERE id = " + id)
    result = cursor.fetchone()[0]
    extTemp = get_currentWeather()
    interTemp = get_internal_temp()
    if result == True:
        if extTemp > interTemp:
            interTemp = interTemp - 2
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"

        elif extTemp < interTemp:
            interTemp = interTemp + 2
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"

    elif result == False:
        if extTemp > interTemp:
            interTemp = interTemp + 2
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"
        elif extTemp < interTemp:
            interTemp = interTemp - 2
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"
    
    
    #cursor.execute(update)
    cursor.execute(tempUpdate)
    conn.commit()
    ##print(cursor.rowcount, "record(s) affected")

def toggle_thermostatW(dataTable, state, id):
    cursor.execute( "SELECT " + state + " FROM " + dataTable  + " WHERE id = " + id)
    result = cursor.fetchone()[0]
    extTemp = get_currentWeather()
    interTemp = get_internal_temp()
    if result == True:
        if extTemp > interTemp:
            interTemp = interTemp - 1
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"

        elif extTemp < interTemp:
            interTemp = interTemp + 1
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"

    elif result == False:
        if extTemp > interTemp:
            interTemp = interTemp + 1
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"
        elif extTemp < interTemp:
            interTemp = interTemp - 1
            strInterTemp = str(interTemp)
            tempUpdate = "UPDATE Thermostat SET  temp_reading  = " + strInterTemp + " WHERE thermostat_id = 1"
    
    
    #cursor.execute(update)
    cursor.execute(tempUpdate)
    conn.commit()
    ##print(cursor.rowcount, "record(s) affected")

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
        toggle_light("hourson", 1) #hours on
        toggle_light("cost", .24)  #cost    changed to .24 value since it would not +.12 when set to .12
        update = "UPDATE " + dataTable + " SET " + state + " = " + bool + " WHERE id = " + id
    cursor.execute(update)
    conn.commit()

###################################################################################

#(toggle_electric("electric2", "hourson", "1", 1)) #increase hours on
#(toggle_electric("electric2", "cost", "1", .12 )) #increase cost

@app.route('/', methods=['GET', 'POST'])
def index ():
    if request.method == 'GET':
        #internal_temp = get_internal_temp()
        interTemp = get_internal_temp()
        extTemp = get_currentWeather()
        return render_template('home.html', extTemp=extTemp, interTemp=interTemp)


##################################################################################


@app.route('/home', methods=['GET', 'POST'])
def home ():
    if request.method == 'POST':

        ## Kitchen
        if request.form.get('oh7') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh7 = toggle_electric("electric", "ison", "19")
            return render_template('home.html', oh7=oh7,extTemp=extTemp, interTemp=interTemp)

        ## Living Room
        elif request.form.get('oh6') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh6 = toggle_electric("electric", "ison", "15")
            return render_template('home.html', oh6=oh6,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp7') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp7 = toggle_electric("electric", "ison", "16")
            return render_template('home.html', lamp7=lamp7,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp8') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp8 = toggle_electric("electric", "ison", "17")
            return render_template('home.html', lamp8=lamp8,extTemp=extTemp, interTemp=interTemp)

        ## Garage
        ##  NO FUNCTION


        ## Laundry Room
        ##  NO FUNCTION

        ## Dining Room
        ## NO FUNCTION

        ## Bedroom 1
        elif request.form.get('oh2') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh2 = toggle_electric("electric", "ison", "5")
            return render_template('home.html', oh2=oh2,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp3') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp3 = toggle_electric("electric", "ison", "6")
            return render_template('home.html', lamp3=lamp3,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp4') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp4 = toggle_electric("electric", "ison", "7")
            return render_template('home.html', lamp4=lamp4,extTemp=extTemp, interTemp=interTemp)

        ## Bathroom 1
        elif request.form.get('oh4') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh4 = toggle_electric("electric", "ison", "11")
            return render_template('home.html', oh4=oh4,extTemp=extTemp, interTemp=interTemp)


        ## Bedroom 2
        elif request.form.get('oh3') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh3 = toggle_electric("electric", "ison", "8")
            return render_template('home.html', oh3=oh3,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp5') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp5 = toggle_electric("electric", "ison", "9")
            return render_template('home.html', lamp5=lamp5,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp6') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp6 = toggle_electric("electric", "ison", "10")
            return render_template('home.html', lamp6=lamp6,extTemp=extTemp, interTemp=interTemp)

        ## Master Bedroom
        elif request.form.get('oh1') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh1 = toggle_electric("electric", "ison", "1")
            return render_template('home.html', oh1=oh1,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp1') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp1 = toggle_electric("electric", "ison", "2")
            return render_template('home.html', lamp1=lamp1,extTemp=extTemp, interTemp=interTemp)
        
        elif request.form.get('lamp2') == 'Lamp':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            lamp2 = toggle_electric("electric", "ison", "3")
            return render_template('home.html', lamp2=lamp2,extTemp=extTemp, interTemp=interTemp)


        ## Bathroom 2
        elif request.form.get('oh5') == 'Overhead Light':
            interTemp = get_internal_temp()
            extTemp = get_currentWeather()
            oh5 = toggle_electric("electric", "ison", "13")
            return render_template('home.html', oh5=oh5,extTemp=extTemp, interTemp=interTemp)


        ## Utility Room
        ## NO FUNCTION

        ## Entrance/front hallway
        ## NO FUNCTION
    elif request.method == 'GET':
        interTemp = get_internal_temp()
        extTemp = get_currentWeather()
        return render_template('home.html', extTemp=extTemp, interTemp=interTemp)


######################################################################################

@app.route('/graphs', methods=['GET', 'POST'])
def graphs ():

    elecUsage = fetch_electricUsage()
    elecCost = fetch_electricCost()
    waterCost = fetch_waterCost()
    waterUsage = fetch_waterUsage()
    heaterUsage = fetch_heaterUsage()
    heaterCost = fetch_heaterCost()

    labels = [
        'Electricity', 'Water', 'Heater'
    ]

    values = [
        elecUsage, waterUsage, heaterUsage
    ]

    valuesCost = [
        elecCost, waterCost, heaterCost
    ]

    colors = [
        "#F7464A", "#46BFBD", "#FDB45C", "#FEDCBA",
        "#ABCDEF", "#DDDDDD", "#ABCABC", "#4169E1",
        "#C71585", "#FF4500", "#FEDCBA", "#46BFBD"]

    bar_labels=labels
    bar_values=values
    line_values=valuesCost                     #This is actually bar graph values

    electron = read_file("electric.txt")
    h2o = read_file("water.txt")

    i = electron
    wC = h2o

    return render_template ('graphs.html', title='Monthly Usages', max=2000000, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage, heaterCost=heaterCost, colors=colors, labels=bar_labels, values=bar_values, line_values=line_values, i = i, wC = wC)

#######################################################################################



@app.route('/utility', methods=['GET', 'POST'])
def utility ():

    elecUsage = fetch_electricUsage()
    elecCost = fetch_electricCost()
    waterCost = fetch_waterCost()
    waterUsage = fetch_waterUsage()
    heaterUsage = fetch_heaterUsage()

    if request.method == 'POST':
        ## Kitchen
        if request.form.get('door2') == 'Back Door Toggle':
            door2 = toggle_item("doors", "isopen", "2")
            changeTemp = toggle_thermostat("doors","isopen", "2")
            return render_template('utility.html', door2=door2, changeTemp=changeTemp, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door2_2') == 'Kitchen to Garage':
            changeTemp = toggle_thermostat("doors","isopen", "3")
            door2_2 = toggle_item("doors", "isopen", "3")
            return render_template('utility.html', door2_2=door2_2, changeTemp=changeTemp, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('oh7') == 'Overhead Light':
            oh7 = toggle_electric("electric", "ison", "19")
            return render_template('utility.html', oh7=oh7, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window12') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "12")
            window12 = toggle_item("windows", "isopen", "12")
            return render_template('utility.html',window12=window12, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window13') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "13")
            window13 = toggle_item("windows", "isopen", "13")
            return render_template('utility.html',window13=window13, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        ## Living Room
        elif request.form.get('oh6') == 'Overhead Light':
            oh6 = toggle_electric("electric", "ison", "15")
            return render_template('utility.html', oh6=oh6, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp7') == 'Lamp':
            lamp7 = toggle_electric("electric", "ison", "16")
            return render_template('utility.html', lamp7=lamp7,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp8') == 'Lamp':
            lamp8 = toggle_electric("electric", "ison", "17")
            return render_template('utility.html', lamp8=lamp8, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window8') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "8")
            window8 = toggle_item("windows", "isopen", "8")
            return render_template('utility.html',window8=window8, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window9') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "9")
            window9 = toggle_item("windows", "isopen", "9")
            return render_template('utility.html',window9=window9, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window7') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "7")
            window7 = toggle_item("windows", "isopen", "7")
            return render_template('utility.html',window7=window7, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        elif request.form.get('door1') == 'Door Toggle':
            return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
 
        ## Garage
        elif request.form.get('door3') == 'Door 1 Toggle':
            changeTemp = toggle_thermostat("doors","isopen", "4")
            door3 = toggle_item("doors", "isopen", "4")
            return render_template('utility.html', door3=door3,changeTemp=changeTemp, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door3_2') == 'Door 2 Toggle':
            changeTemp = toggle_thermostat("doors","isopen", "5")
            door3_2 = toggle_item("doors", "isopen", "5")
            return render_template('utility.html', door3_2=door3_2,changeTemp=changeTemp ,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

        ## Laundry Room
        ##  NO FUNCTION

        ## Dining Room
        ## NO FUNCTION

        ## Bedroom 1
        elif request.form.get('oh2') == 'Overhead Light':
            oh2 = toggle_electric("electric", "ison", "5")
            return render_template('utility.html', oh2=oh2, elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp3') == 'Lamp':
            lamp3 = toggle_electric("electric", "ison", "6")
            return render_template('utility.html', lamp3=lamp3, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp4') == 'Lamp':
            lamp4 = toggle_electric("electric", "ison", "7")
            return render_template('utility.html', lamp4=lamp4, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door5') == 'Door Toggle':
            return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window3') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "3")
            window3 = toggle_item("windows", "isopen", "3")
            return render_template('utility.html',window3=window3, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window4') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "4")
            window4 = toggle_item("windows", "isopen", "4")
            return render_template('utility.html',window4=window4, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
  
        ## Bathroom 1
        elif request.form.get('oh4') == 'Overhead Light':
            oh4 = toggle_electric("electric", "ison", "11")
            return render_template('utility.html', oh4=oh4, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door6') == 'Door Toggle':
            return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window10') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "10")
            window10 = toggle_item("windows", "isopen", "10")
            return render_template('utility.html',window10=window10, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

        ## Bedroom 2
        elif request.form.get('oh3') == 'Overhead Light':
            oh3 = toggle_electric("electric", "ison", "8")
            return render_template('utility.html', oh3=oh3, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp5') == 'Lamp':
            lamp5 = toggle_electric("electric", "ison", "9")
            return render_template('utility.html', lamp5=lamp5, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp6') == 'Lamp':
            lamp6 = toggle_electric("electric", "ison", "10")
            return render_template('utility.html', lamp6=lamp6, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door7') == 'Door Toggle':
            return render_template('utility.html')
        
        elif request.form.get('window5') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "5")
            window5 = toggle_item("windows", "isopen", "5")
            return render_template('utility.html',window5=window5, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window6') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "6")
            window6 = toggle_item("windows", "isopen", "6")
            return render_template('utility.html',window6=window6, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

        ## Master Bedroom
        elif request.form.get('oh1') == 'Overhead Light':
            oh1 = toggle_electric("electric", "ison", "1")
            return render_template('utility.html', oh1=oh1, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp1') == 'Lamp':
            lamp1 = toggle_electric("electric", "ison", "2")
            return render_template('utility.html', lamp1=lamp1, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('lamp2') == 'Lamp':
            lamp2 = toggle_electric("electric", "ison", "3")
            return render_template('utility.html', lamp2=lamp2, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door8') == 'Door Toggle':
            return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window2') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "2")
            window2 = toggle_item("windows", "isopen", "2")
            return render_template('utility.html',window2=window2, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window1') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "1")
            window1 = toggle_item("windows", "isopen", "1")
            return render_template('utility.html',window1=window1, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

        ## Bathroom 2
        elif request.form.get('oh5') == 'Overhead Light':
            oh5 = toggle_electric("electric", "ison", "13")
            return render_template('utility.html', oh5=oh5, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('door9') == 'Door Toggle':
            return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)
        
        elif request.form.get('window11') == 'Window':
            changeTemp = toggle_thermostatW("windows","isopen", "11")
            window11 = toggle_item("windows", "isopen", "11")
            return render_template('utility.html',window11=window11, changeTemp=changeTemp,elecUsage=elecUsage, elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

        ## Utility Room
        ## NO FUNCTION

        ## Entrance/front hallway
        elif request.form.get('door11') == 'Door Toggle':
            door11 = toggle_item("doors", "isopen", "1")
            changeTemp = toggle_thermostat("doors","isopen", "1")
            return render_template('utility.html', door11=door11,changeTemp=changeTemp , elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)

    elif request.method == 'GET':
        return render_template('utility.html', elecCost=elecCost, waterCost=waterCost, waterUsage=waterUsage, heaterUsage=heaterUsage)





##@app.errorhandler(404)
##def page_not_found (e):
##    return render_template ('404.html'),404

if __name__ == '__main__':
    app.run(debug=True)
    conn.close()

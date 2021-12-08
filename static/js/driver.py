import js2py
from tempElectric import *
from tempHeater import *
from tempWH import *
from tempHVAC import *
  
js2py.translate_file("electric.js", "tempElectric.py")
tempElectric()

js2py.translate_file("heater.js", "tempHeater.py")
tempHeater()

js2py.translate_file("waterheater.js", "tempWH.py")
tempWH()

js2py.translate_file("hvacSim.js", "tempHVAC.py")
tempHVAC()

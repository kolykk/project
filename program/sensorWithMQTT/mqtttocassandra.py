import paho.mqtt.client as mqtt
import datetime
import time
import uuid




from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
)

line_bot_api = LineBotApi('CdDYlY9qqNN7g64umv6/8UFdJE2x44h+8n2IdV74kiEY8OIftb9SMwqjr9O4VzEFu7Xh/V/Fkh5fVpqiGuzntROv/PocnPGQXtrN5i0azudzHYxapZqVnTpfrQZF2IxwqkRvkZFGyQ3GWbBUs0H2BAdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('d42dbcc257489b8600bd879c33ca3d44')

from cassandra.cluster import Cluster

cluster = Cluster(['127.0.0.1'])

cluster = Cluster()
session = cluster.connect('information')

# string for set MQTT Host
mqtthost="localhost"
#integer for select port to connect to mqtt host
port= 1883
#integer for connection timeout  mqtt host
timeout=60
#string for set MQTT subscribe topic_for_tempAndHumid
topic_for_tempAndHumid="value_tempAndHumid"
#string for set host database

client = mqtt.Client()


def unix_time(dt):
  
  epoch = datetime.datetime.utcfromtimestamp(0)
  delta = dt - epoch
  return delta.total_seconds()

def unix_time_millis(dt):
    return long(unix_time(dt) * 1000.0)


def on_message(client, userdata, msg):
  print(str(msg.payload))
  node_id=str(msg.payload)
  temp_=str(msg.payload)
  humid_=str(msg.payload)

  totalvalue = str(msg.payload)
  a,b,c = totalvalue.split(",")

  #select sensor location
  rows = session.execute("SELECT s_location FROM registration.sensor WHERE s_id = "+a)
  for location_row in rows:
    location = location_row.s_location


  session.execute("INSERT INTO transaction (s_id,currenttime,s_tempvalue,s_humidvalue,t_id,s_location) VALUES (%s,%s,%s,%s,%s,%s)", [a,unix_time_millis(datetime.datetime.now())-25200000,float(b),float(c),uuid.uuid1(),location])  # right 
  
  rows = session.execute("SELECT start_time, finish_time, control_humid, control_temp,s_name FROM registration.detail WHERE s_id="+a)
  i=1
  for user_row in rows:
    print user_row.start_time, user_row.finish_time, user_row.control_humid,user_row.control_temp, user_row.s_name

    t = h = False
    
    start = datetime.datetime.strptime(user_row.start_time, '%H:%M').time()
    finish = datetime.datetime.strptime(user_row.finish_time, '%H:%M').time()
    now = datetime.datetime.now().time()

    # print (start)
    # print (finish)
    # print (now)

    if start <= now <= finish :   
      if float(b) > user_row.control_temp+2 or float(b) < user_row.control_temp-2:
        #line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='Temp warnings'))
        t = True
      if float(c) > user_row.control_humid+2 or float(c) < user_row.control_humid-2 :
        #line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='Humid warnings'))
        h = True
      if h and t:
        line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='#DETAIL-'+str(i)+' : Temperature & Reletive Humidity Warnings! \n The Temperature now is '+ b + '\n The Relative Humidity now is ' + c + '\n\n-----------------------------\n'' The Detail name is '+ user_row.s_name +'\n The temperature control is '+ str(user_row.control_temp)  + '\n The Relative Humidity control is '+ str(user_row.control_humid) + '\n Duration of Start Time is ' + user_row.start_time + '\n Duration of Finish Time is ' + user_row.finish_time))
      elif t:
        line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='#DETAIL-'+str(i)+' : Temperature Warnings! \n The Temperature now is '+ b + '\n The Relative Humidity now is ' + c + '\n\n-----------------------------\n'' The Detail name is '+ user_row.s_name + '\n The temperature control is '+ str(user_row.control_temp)  + '\n The Relative Humidity control is '+ str(user_row.control_humid) + '\n Duration of Start Time is ' + user_row.start_time + '\n Duration of Finish Time is ' + user_row.finish_time))
      elif h:
        line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='#DETAIL-'+str(i)+' : Reletive Humidity Warnings! \n The Temperature now is '+ b + '\n The Relative Humidity now is ' + c + '\n\n-----------------------------\n'' The Detail name is '+ user_row.s_name + '\n The temperature control is '+ str(user_row.control_temp)  + '\n The Relative Humidity control is '+ str(user_row.control_humid) + '\n Duration of Start Time is ' + user_row.start_time + '\n Duration of Finish Time is ' + user_row.finish_time))
      # else:
      #   line_bot_api.push_message('Ubf06abaa5636d4204976ee3939dcab40', TextSendMessage(text='#DETAIL-'+str(i)+' : The Environmental are correct !!! '))
      i += 1
    else :
      #print ('123')
     
def on_connect(client, userdata, rc):
   print ("Connected with result code "+str(rc))
# Subscribing in on_connect() means that if we lose the connection and
# reconnect then subscriptions will be renewed.

#Connect to mqtt host e.g. mqtthost=localhost,port=1883 and timeout=60 seconds 
client.connect(mqtthost,port,timeout)
#call function on_connect
client.on_connect = on_connect
# The callback for when the client receives a CONNACK response from the server.
  
#call function on_message
client.on_message = on_message
time.sleep(2)

client.subscribe(topic_for_tempAndHumid)
# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
import paho.mqtt.client as mqtt
import time
mqtthost="localhost"
#integer for select port to connect to mqtt host
port= 1883
#integer for connection timeout  to mqtt host 
timeout=60
topic_for_trigger_tempAndHumid="trig_tempAndHumid"
#node_ID="8f9ca68c-585b-4432-979c-2d040a657a4f"
client = mqtt.Client()
client.connect(mqtthost,port,timeout)

while True:
#Connect to mqtt host e.g. mqtthost=localhost,port=1883 and timeout=60 seconds 
	
#call function on_connect
	client.publish(topic_for_trigger_tempAndHumid)
	time.sleep(60)


// Coding By IOXhop : http://www.ioxhop.com/
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTPIN 4     // what digital pin we're connected to
// Config MQTT Server
#define mqtt_server "192.168.43.107"
#define mqtt_port 1883

// Update these with values suitable for your network.
//const char* ssid = "CSL_IoT";
//const char* password = "ITSIoT3666";
const char* ssid = "kolykk";
const char* password = "kkkkkkkk";
char* mqtt_outtopic_for_tempAndHumid = "value_tempAndHumid";
char* mqtt_intopic_for_tempAndHumid = "trig_tempAndHumid";
char* nodeMCU_ID = "7adf69e7-58a2-49cc-8620-df9c2d62fe2b"; //sensor_id
String clientName="0001";


// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

// Initialize DHT sensor.
// Note that older versions of this library took an optional third parameter to
// tweak the timings for faster processors.  This parameter is no longer needed
// as the current DHT reading algorithm adjusts itself to work on faster procs.
DHT dht(DHTPIN, DHTTYPE);



WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
 
  
  Serial.begin(115200);
  delay(10);
  
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);


 // IPAddress local_ip = {10,200,140,11};   //ตั้งค่า IP
 // IPAddress gateway={10,200,140,254};    //ตั้งค่า IP Gateway
//  IPAddress subnet={255,255,255,0};   //ตั้งค่า Subnet
          //setค่าไปยังโมดูล
 // WiFi.config(local_ip,gateway,subnet);
  WiFi.begin(ssid, password);
  


  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP()); //localIP NodeMCU WIFI
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
  Serial.println("DHT11 Already!");
}

void loop() {
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection ...");
    if (client.connect((char*) clientName.c_str())) {
      Serial.println("connected");
      client.subscribe(mqtt_intopic_for_tempAndHumid);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
      return;
    }
  }
  client.loop();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String msg = "";
  int i=0;
  while (i<length) msg += (char)payload[i++];
   {
                  // Reading temperature or humidity takes about 250 milliseconds!
                  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
                  float h = dht.readHumidity();
                  // Read temperature as Celsius (the default)
                  float t = dht.readTemperature();
                  // Read temperature as Fahrenheit (isFahrenheit = true)
                  float f = dht.readTemperature(true);
                
                  // Check if any reads failed and exit early (to try again).
                  if (isnan(h) || isnan(t) || isnan(f)) {
                    Serial.println("Failed to read from DHT sensor!");
                    return;
                  }
                
                  // Compute heat index in Fahrenheit (the default)
                  float hif = dht.computeHeatIndex(f, h);
                  // Compute heat index in Celsius (isFahreheit = false)
                  float hic = dht.computeHeatIndex(t, h, false);

    String temp = String(t);
    String humd = String(h);
    String ID = String(nodeMCU_ID);
    String humd_temp=ID+","+temp+","+humd;
    
    client.publish(mqtt_outtopic_for_tempAndHumid,humd_temp.c_str());
    Serial.println("Send !");
    Serial.println ("Temperature is " + temp);
    Serial.println ("Relative Humidity is " + humd);
    return;
  }
 
  Serial.println(msg);
}

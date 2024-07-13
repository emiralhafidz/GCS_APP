#include <Wire.h>
#include <QMC5883LCompass.h>
#include <MPU6050_light.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Set your access point network credentials
const char* ssid = "burjogober";
const char* password = "sotobabat";

const char* server = "35.188.128.4";
WiFiClient espClient;
PubSubClient mqttClient(espClient);

MPU6050 mpu(Wire);
QMC5883LCompass compass;

unsigned long timer = 0;
unsigned long timerResponse = 0;

TinyGPSPlus gps;
SoftwareSerial mygps(13, 15);  // GPS Tx Pin - NodeMCU D2, GPS Rx Pin NodeMCU D1

//deklarasi variabel untuk menyimpan data sementara
float roll, pitch, yaw, heading, latitude, longitude;
unsigned long timeResponse;

void setup() {
  Serial.begin(9600);
  Wire.begin();

  mygps.begin(9600);
  Serial.println("GPS TESTING");
  // Connect to WiFi
  setupWifi();
  mqttClient.setServer(server, 1883);

  compass.init();

  byte status = mpu.begin();
  Serial.print(F("MPU6050 status: "));
  Serial.println(status);
  while (status != 0) {}  // stop everything if could not connect to MPU6050

  Serial.println(F("Calculating offsets, do not move MPU6050"));
  delay(1000);
  // mpu.upsideDownMounting = true; // uncomment this line if the MPU6050 is mounted upside-down
  mpu.calcOffsets();  // gyro and accelero
  Serial.println("Done!\n");
}

void loop() {
  compass.read();
  mpu.update();
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();

  // Read GPS data
  if (mygps.available() > 0) {
    gps.encode(mygps.read());
    if (gps.location.isUpdated()) {
      latitude = gps.location.lat();
      longitude = gps.location.lng();
      Serial.print("Latitude= ");
      Serial.print(latitude, 6);
      Serial.print(" Longitude= ");
      Serial.println(longitude, 6);
    }
  }

  if ((millis() - timer) > 1000) {  //program dieksekusi setiap detik
    kompas();
    gyro();
    publishData();
    timer = millis();
  }
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("arduinoClient")) {
      Serial.println("connected MQTT");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setupWifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void kompas() {
  int x = compass.getX();
  int y = compass.getY();
  heading = atan2(y, x) * 180 / PI;
  if (heading < 0) {
    heading += 360;  // Konversi ke rentang 0-360 derajat
  }
  Serial.print("Yaw Degrees: ");
  Serial.println(heading);
}

void gyro() {
  roll = mpu.getAngleX();
  pitch = mpu.getAngleY();
  yaw = mpu.getAngleZ();

  Serial.print("Roll : ");
  Serial.print(roll);
  Serial.print("\tPitch : ");
  Serial.print(pitch);
  Serial.print("\tYaw : ");
  Serial.println(yaw);
}

void publishData() {
  char msgRoll[50];
  char msgPitch[50];
  char msgYaw[50];
  char msgHeading[50];
  char msgTimeResponse[50];
  char msgLatitude[50];
  char msgLongitude[50];

  dtostrf(roll, 6, 2, msgRoll);
  dtostrf(pitch, 6, 2, msgPitch);
  dtostrf(yaw, 6, 2, msgYaw);
  dtostrf(heading, 6, 2, msgHeading);

  unsigned long startTime = micros();

  mqttClient.publish("mpu6050/roll", msgRoll);
  mqttClient.publish("mpu6050/pitch", msgPitch);
  mqttClient.publish("mpu6050/yaw", msgYaw);
  mqttClient.publish("compass/heading", msgHeading);

  if (gps.location.isValid()) {
    dtostrf(latitude, 6, 2, msgLatitude);
    dtostrf(longitude, 6, 2, msgLongitude);
    mqttClient.publish("gps/latitude", msgLatitude);
    mqttClient.publish("gps/longitude", msgLongitude);
  }

  unsigned long endTime = micros();
  timeResponse = endTime - startTime;
  Serial.print("Time response : ");
  Serial.print(timeResponse);
  Serial.println(" us");

  ltoa(timeResponse, msgTimeResponse, 10);
  mqttClient.publish("data/response", msgTimeResponse);
}

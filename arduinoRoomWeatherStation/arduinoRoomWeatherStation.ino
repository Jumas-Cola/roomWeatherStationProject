#include "DHT.h"

#define mq2Pin A0      // Co2 sensor pin
#define dhtPin 3       // Temperature/Humidity sensor pin
#define vccPin 5       // Positive voltage pin
#define dhtType DHT11  // Model of Temperature/Humidity sensor

int ppmValue;
float humidityValue;
float tempValue;
float heatIndex;

DHT dht(dhtPin, dhtType);

void setup() {
  pinMode(mq2Pin, INPUT);
  pinMode(vccPin, OUTPUT);

  digitalWrite(vccPin, HIGH);

  dht.begin();
  
  Serial.begin(9600);
}

void loop() {

  ppmValue = analogRead(mq2Pin);
  humidityValue = dht.readHumidity();
  tempValue = dht.readTemperature();

  // If not recieved sensor value - return
  if (isnan(humidityValue) || isnan(tempValue) || isnan(ppmValue)) {
    return;
  }

  // Compute heat index in Celsius
  heatIndex = dht.computeHeatIndex(tempValue, humidityValue, false);
  
  Serial.print(humidityValue);
  Serial.print(",");
  Serial.print(tempValue);
  Serial.print(",");
  Serial.print(ppmValue);
  Serial.print(",");
  Serial.println(heatIndex);

  delay(1000);
}

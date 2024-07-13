const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");
const now = require("performance-now");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "drone-producer",
  brokers: ["localhost:9092"],
});

const topics = [
  { nama: "roll", topic: "mpu6050/roll", kafkaTopic: "kafka-roll" },
  { nama: "pitch", topic: "mpu6050/pitch", kafkaTopic: "kafka-pitch" },
  { nama: "yaw", topic: "mpu6050/yaw", kafkaTopic: "kafka-yaw" },
  { nama: "compass", topic: "compass/heading", kafkaTopic: "kafka-heading" },
  { nama: "latitude", topic: "gps/latitude", kafkaTopic: "kafka-latitude" },
  { nama: "longitude", topic: "gps/longitude", kafkaTopic: "kafka-longitude" },
  { nama: "time response mqtt", topic: "data/response", kafkaTopic: "mqtt-response" },
];

let messageCount = 0;
let startTimeKafka;

//-------------------------program subscriber start---------------------------------
client.on("connect", () => {
  topics.forEach((index) => {
    client.subscribe(index.topic, (err) => {
      if (!err) {
        console.log(`Berhasil subscriber ke ${index.topic}`);
      } else {
        console.log(`Gagal subscriber ke ${index.topic}`);
      }
    });
  });
});

client.on("message", async (topic, message) => {
  const startTime = now();
  for (const index of topics) {
    if (index.topic === topic) {
      const dataMqtt = message.toString();
      // argumen untuk kafka producer
      await runProducer([
        { topic: index.kafkaTopic, messages: [{ value: dataMqtt }] },
      ]);
      // ukur latency dari mqtt
      if (index.topic === "data/response") {
        const endTime = now();
        const receiveTime = endTime - startTime;
        const mqttResponse = parseFloat(message.toString()); // konversi dari string ke float
        const mqttLatency = (mqttResponse - receiveTime).toFixed(2);
        // mengambil data latency untuk ke kafka producer
        await sendLatency(mqttLatency);

        console.log("------------------------------------");
        console.log(`time response mqtt : ${mqttResponse} us`);
        console.log(`time response mqtt : ${mqttResponse / 1000} ms`);
        console.log("");
        console.log(`nilai mqttLatency :${mqttLatency} us `);
        console.log(`nilai mqttLatency :${(mqttLatency / 1000).toFixed(2)} ms `);
        console.log("------------------------------------");
      }
    }
  }
});
//-------------------------program subscriber End---------------------------------

//-------------------------program kafka start---------------------------------

const producer = kafka.producer();
const connProducer = async () => {
  try {
    await producer.connect();
    console.log("producer terhubung");
  } catch (error) {
    console.log(`koneksi producer gagal : ${error}`);
  }
};
connProducer();

const runProducer = async (batchMessages) => {
  try {
    if (messageCount === 0) {
      startTimeKafka = now();
    }
    await producer.sendBatch({
      topicMessages: batchMessages,
    });
    messageCount++;
    if (messageCount === topics.length) {
      const endTimeKafka = now();
      const kafkaResponse = (endTimeKafka - startTimeKafka).toFixed(2);
      messageCount = 0;
      await sendKafkaResponse(kafkaResponse); // Ensure kafkaResponse is sent at the right time
    }
    batchMessages.forEach(({ topic, messages }) => {
      messages.forEach(({ value }) => {
        console.log(`${topic} : ${value}`);
      });
    });
  } catch (error) {
    console.log("kafka producer error : ", error);
  }
};

const sendLatency = async (mqttLatency) => {
  try {
    await runProducer([
      { topic: "mqtt-latency", messages: [{ value: mqttLatency }] },
    ]);
  } catch (error) {
    console.log(`Error pengiriman mqttLatency`, error);
  }
};

const sendKafkaResponse = async (kafkaResponse) => {
  try {
    await runProducer([
      {
        topic: "kafka-response",
        messages: [{ value: kafkaResponse.toString() }],
      },
    ]);
  } catch (error) {
    console.log(`Error pengiriman kafkaResponse`, error);
  }
};

//-------------------------program kafka end---------------------------------

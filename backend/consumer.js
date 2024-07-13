const { Kafka } = require("kafkajs");
const WebSocket = require('ws');

const kafka = new Kafka({
  clientId: "drone-kafka",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "drone-consumer" });


const wss = new WebSocket.Server({ port: 8085 });


const clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('New WebSocket connection');

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
    console.log('WebSocket connection closed');
  });
});

const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const run = async () => {
  try {
    await consumer.connect();

    // Subscribe ke tiga topik
    await consumer.subscribe({ topic: "kafka-roll", fromBeginning: true });
    await consumer.subscribe({ topic: "kafka-pitch", fromBeginning: true });
    await consumer.subscribe({ topic: "kafka-yaw", fromBeginning: true });
    await consumer.subscribe({ topic: "kafka-heading", fromBeginning: true });
    await consumer.subscribe({ topic: "kafka-latitude", fromBeginning: true });
    await consumer.subscribe({ topic: "kafka-longitude", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = {
          topic,
          partition,
          value: message.value.toString(),
        };
        console.log(data);
        broadcast(data); // Mengirim data melalui WebSocket
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

run();
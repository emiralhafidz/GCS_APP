const { Kafka } = require("kafkajs");
const performance = require("performance-now");
const connection = require("./connection");

const kafka = new Kafka({
  clientId: "drone-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "drone-store" });

const kafkaTopic = [
  "kafka-roll",
  "kafka-pitch",
  "kafka-yaw",
  "kafka-heading",
  "kafka-latitude",
  "kafka-longitude",
  "mqtt-response",
  "mqtt-latency",
  "kafka-response",
];

let mqttResponse, mqttLatency;
let kafkaResponse, kafkaLatency;
let roll, pitch, yaw, heading, latitude, longitude;

const connConsumer = async () => {
  try {
    await consumer.connect();
  } catch (error) {
    console.log(`Kafka consumer error : ${error}`);
  }
};
connConsumer();

const runConsumer = async () => {
  try {
    for (const topic of kafkaTopic) {
      await consumer.subscribe({ topic: topic, fromBeginning: false });
    }
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const startTime = performance();

        if (topic === "mqtt-response") {
          mqttResponse = (parseFloat(message.value) / 1000).toFixed(2);
        } else if (topic === "mqtt-latency") {
          mqttLatency = (parseFloat(message.value) / 1000).toFixed(2);
        } else if (topic === "kafka-response") {
          kafkaResponse = (parseFloat(message.value) / 1000).toFixed(2);
        }

        if (topic === "kafka-roll") {
          roll = message.value.toString();
        } else if (topic === "kafka-pitch") {
          pitch = message.value.toString();
        } else if (topic === "kafka-yaw") {
          yaw = message.value.toString();
        } else if (topic === "kafka-heading") {
          heading = message.value.toString();
        } else if (topic === "kafka-latitude") {
          latitude = message.value.toString();
        } else if (topic === "kafka-longitude") {
          longitude = message.value.toString();
        }

        if (topic.startsWith("kafka-")) {
          const endTime = performance();
          const receiveTime = endTime - startTime;
          kafkaLatency = (kafkaResponse - receiveTime).toFixed(2);
          console.log(`kafkaResponse: ${kafkaResponse} ms`);
          console.log(`kafkaLatency: ${kafkaLatency} ms`);
          console.log(`mqttResponse: ${mqttResponse} ms`);
          console.log(`mqttLatency: ${mqttLatency} ms`);
        }

        // memastikan semua variabel tidak undefined sebelum masuk database
        if (
          [
            roll,
            pitch,
            yaw,
            mqttResponse,
            kafkaResponse,
            mqttLatency,
            kafkaLatency,
          ].some((val) => val === undefined)
        ) {
          console.error("One or more values are undefined:");
          console.error(`roll: ${roll}, pitch: ${pitch}, yaw: ${yaw}`);
          console.error(
            `mqttResponse: ${mqttResponse}, kafkaResponse: ${kafkaResponse}`
          );
          console.error(
            `mqttLatency: ${mqttLatency}, kafkaLatency: ${kafkaLatency}`
          );
        } else {
          const totalTimeResponse = (
            parseFloat(kafkaResponse) + parseFloat(mqttResponse)
          ).toFixed(2);
          const totalLatency = (
            parseFloat(kafkaLatency) + parseFloat(mqttLatency)
          ).toFixed(2);
          console.log(`totalTimeResponse: ${totalTimeResponse} ms`);
          console.log(`totalLatency: ${totalLatency} ms`);
          storeData(roll, pitch, yaw);
          storeResponse(
            mqttResponse,
            kafkaResponse,
            mqttLatency,
            kafkaLatency,
            totalTimeResponse,
            totalLatency
          );
        }
      },
    });
  } catch (error) {
    console.log(`consumer error: `, error);
  }
};
runConsumer();

const limitRows = async (tableName, limit) => {
  try {
    const sqlCount = `SELECT COUNT(*) AS count FROM ${tableName}`;
    const [rows] = await connection.promise().query(sqlCount);
    const count = rows[0].count;

    if (count >= limit) {
      const sqlDelete = `DELETE FROM ${tableName} ORDER BY timestamp ASC LIMIT ${
        count - limit + 1
      }`;
      await connection.promise().query(sqlDelete);
    }
  } catch (error) {
    console.error(`Error limiting rows in ${tableName}:`, error);
  }
};

const storeData = async (roll, pitch, yaw) => {
  try {
    await limitRows("sensor_data", 300);
    const sql =
      "INSERT INTO `sensor_data`(`timestamp`, `roll`, `pitch`, `yaw`) VALUES (NOW(3), ?, ?, ?)";
    const values = [roll, pitch, yaw];
    connection.execute(sql, values, (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return;
      }
      console.log("Data MPU sukses dimasukkan ke database");
    });
  } catch (error) {
    console.log("input database error", error);
  }
};

const storeResponse = async (
  mqttResponse,
  kafkaResponse,
  mqttLatency,
  kafkaLatency,
  totalTimeResponse,
  totalLatency
) => {
  try {
    await limitRows("response_data", 300);
    const sql =
      "INSERT INTO `response_data`(`timestamp`, `mqttResponse`, `kafkaResponse`, `mqttLatency`, `kafkaLatency`, `sumResponse`, `sumLatency`) VALUES (NOW(3), ?, ?, ?, ?, ?, ?)";
    const values = [
      mqttResponse,
      kafkaResponse,
      mqttLatency,
      kafkaLatency,
      totalTimeResponse,
      totalLatency,
    ];
    connection.execute(sql, values, (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err);
        return;
      }
      console.log("Data response sukses dimasukkan ke database");
    });
  } catch (error) {
    console.log("input database error", error);
  }
};

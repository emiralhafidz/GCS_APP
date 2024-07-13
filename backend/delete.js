const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "admin-client",
  brokers: ["localhost:9092"]
});

const admin = kafka.admin();

const resetOffsetsAndDeleteTopics = async () => {
  try {
    await admin.connect();

    const topics = [
      "kafka-roll",
      "kafka-pitch",
      "kafka-yaw",
      "kafka-heading",
      "kafka-latitude",
      "kafka-longitude",
      "mqtt-response",
      "mqtt-latency",
      "kafka-response"
    ];

    // Reset offsets for both groups
    await Promise.all(
      ["drone-store", "drone-consumer"].map(async groupId => {
        for (const topic of topics) {
          await admin.resetOffsets({
            groupId: groupId,
            topic: topic,
            earliest: true
          });
        }
      })
    );

    // Delete topics
    await admin.deleteTopics({
      topics: topics
    });

    console.log("Offsets reset and topics deleted successfully.");

    await admin.disconnect();
  } catch (err) {
    console.error("Error resetting offsets and deleting topics:", err);
  }
};

resetOffsetsAndDeleteTopics();

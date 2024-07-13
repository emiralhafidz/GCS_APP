const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Pastikan alamat dan port ini benar
});

const admin = kafka.admin();

const displayGroupsAndTopics = async () => {
  try {
    await admin.connect();

    // Mengambil semua groupId konsumen
    const consumerGroups = await admin.listGroups();
    const groupIds = consumerGroups.groups.map(group => group.groupId);

    console.log('Consumer Groups:');
    if (groupIds.length > 0) {
      groupIds.forEach(groupId => console.log(`- ${groupId}`));
    } else {
      console.log('No consumer groups found');
    }

    // Mengambil semua topik
    const topics = await admin.listTopics();

    console.log('\nTopics:');
    if (topics.length > 0) {
      topics.forEach(topic => console.log(`- ${topic}`));
    } else {
      console.log('No topics found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await admin.disconnect();
  }
};

displayGroupsAndTopics();

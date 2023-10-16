import * as amqp from "amqplib";

const queueNames = ["queue_1", "queue_2", "queue_3", "queue_4", "queue_5"];

async function main() {
  const connection = await amqp.connect("amqp://localhost");

  for (const queueName of queueNames) {
    const channel = await connection.createChannel();

    // Declare and bind queues to the exchange with routing key
    await channel.assertQueue(queueName);
    channel.bindQueue(queueName, "your_direct_exchange", queueName);

    console.log(`Consuming from ${queueName}`);

    // Consumer for each queue
    channel.consume(queueName, (message) => {
      if (message) {
        console.log(`Received: ${message.content.toString()}`);
        // Process the message here
        channel.ack(message);
      }
    });
  }
}

main().catch(console.error);

import * as amqp from "amqplib";

const exchangeName = "your_direct_exchange";
const messageCount = 20;

async function main() {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();

  // Declare the direct exchange
  await channel.assertExchange(exchangeName, "direct");

  // Producer sends messages to the exchange
  for (let i = 0; i < messageCount; i++) {
    const queue = (i % 5) + 1;
    const routingKey = `queue_${queue}`;
    const message = `Message ${i} to ${routingKey}`;

    channel.publish(exchangeName, routingKey, Buffer.from(message));
    console.log(`Sent: ${message}`);
  }

  await channel.close();
  await connection.close();
}

main().catch(console.error);

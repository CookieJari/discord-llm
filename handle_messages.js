class Bot {
  // Constructor - no need for Client here
  constructor() {}

  // Method to say hello
  sayHello(name = "User") {
    console.log(`Hello, ${name}!`);
  }

  // Method to mention a user (you could pass the username)
  mentionUser(username) {
    console.log(`Hey @${username}, you're mentioned!`);
  }

  // Method to log a message
  logMessage(message) {
    console.log(`Message: ${message}`);
  }

  // You can add any other random methods as needed
  randomNumber() {
    const number = Math.floor(Math.random() * 100) + 1;
    console.log(`Your random number is: ${number}`);
    return number;
  }

  async handleMessage(message) {
    if (message.author.bot) return;

    // Get the channel and server (guild) details

    const channelName = message.channel.name; // Channel name
    const guildName = message.guild.name; // Server (guild) name

    // Fetch the last 5 messages in the same channel
    try {
      const messages = await message.channel.messages.fetch({ limit: 5 });

      // Log the last 5 messages
      console.log(`--- Last 5 Messages in ${guildName} - ${channelName} ---`);
      messages.reverse().forEach((msg) => {
        const timestamp = msg.createdAt;
        const formattedTimestamp = timestamp.toLocaleString();
        console.log(
          `[${formattedTimestamp}: ${msg.author.tag}] in [${channelName}]: ${msg.content}`
        );
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    console.log(
      `[${message.author.tag}] in [${guildName} - ${channelName}]: ${message.content}`
    );
  }
}

module.exports = Bot;

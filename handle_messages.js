// import ollama from "ollama";
const ollama = require("ollama").default;

class Bot {
  // Constructor - no need for Client here
  constructor() {
    this.responseFormat = {
      type: "object",
      properties: {
        needResponse: {
          type: "boolean",
        },
        message: {
          type: "string",
        },
      },
      required: ["needResponse", "message"],
    };
  }

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

  async handleMessage(message, client) {
    if (message.author.bot) return;

    // Get the channel and server (guild) details

    const channelName = message.channel.name; // Channel name
    const channel = message.channel;
    const guildName = message.guild.name; // Server (guild) name
    let formattedMessages = [];

    let systemPrompt =
      "Your are MayBot. A bot in a discord server. Your goal is understand if people are talking to you based on the chat history. Only write True for 'needResponse' if you need to respond. Else, put True. Write in the 'message' section what your response to the users would be.";
    // "You are MayBot. Your goal is to respond to the users and engage in their conversation. I want you to act and speak like you are Joe Goldberg from the Netflix Series 'You'. But don't flirt with them. You are to always respond in a JSON format. Respond in this format {needResponse: Boolean, message: string}. Put needResponse as True if you think the people in the conversation is calling you or asking for your input. If they are not talking to you or is calling you, set 'needResponse' to False. Do not assume the users are always talking to you. Remember that you are just one user in their group. In the message part put in there what you are going to say.";

    formattedMessages.push({
      role: "system",
      content: systemPrompt,
    });

    // Fetch the last 5 messages in the same channel
    try {
      const messages = await message.channel.messages.fetch({ limit: 5 });

      // Log the last 5 messages
      console.log(`--- Last 5 Messages in ${guildName} - ${channelName} ---`);
      messages.reverse().forEach((msg) => {
        let timestamp = msg.createdAt;
        let formattedTimestamp = timestamp.toLocaleString();
        let displayName =
          msg.member?.displayName ||
          msg.author.displayName ||
          msg.author.username;

        let formattedMessage = `[${formattedTimestamp}: ${displayName}]: ${msg.cleanContent}`;
        if (msg.author.id === client.user.id) {
          // message was sent by the bot
          formattedMessages.push({
            role: "assistant",
            content: formattedMessage,
          });
        } else {
          formattedMessages.push({ role: "user", content: formattedMessage });
        }

        console.log(formattedMessage);
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    console.log("\n\n\n HERE ARE THE MESSAGES");
    console.log(formattedMessages);
    console.log("Starting the response...");
    const response = await ollama.chat({
      model: "gemma3:4b",
      messages: formattedMessages,
      format: this.responseFormat,
    });
    console.log("Here is the response");

    console.log(response.message.content);

    return response.message.content;
  }
}

module.exports = Bot;

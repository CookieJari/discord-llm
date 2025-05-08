const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const Bot = require("./handle_messages.js");
const { token } = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Maybe this is already here:
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord
client.login(token); // or your token directly

// ✳️ PUT THIS PART RIGHT BELOW THE READY BLOCK
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const bot = new Bot();
  response = await bot.handleMessage(message, client);
  try {
    const obj = JSON.parse(response);
    if (obj.needResponse) {
      message.channel.send(obj.message);
    } else {
      return;
    }
  } catch (error) {
    console.error("Invalid JSON:", error);
  }
});

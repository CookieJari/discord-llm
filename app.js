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
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const bot = new Bot();
  bot.handleMessage(message);
});

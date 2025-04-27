// src/client.js
import { Client, GatewayIntentBits, Collection } from 'discord.js';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: { status: 'online' }, // Configura el estado inicial del bot
});

client.commands = new Collection();

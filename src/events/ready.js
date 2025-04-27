// src/events/ready.js
import { client } from '../client.js';

client.once('ready', () => {
  console.log(`☀️ ¡Sunshine Bot está online como ${client.user.tag}!`);
});

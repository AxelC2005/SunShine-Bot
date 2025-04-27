import 'dotenv/config';
import { client } from './client.js';
import { data as registerCommand, execute as registerExecute } from './commands/register.js';
import { data as helpCommand, execute as helpExecute } from './commands/help.js';
import { data as setPrefixCommand, execute as setPrefixExecute } from './commands/setprefix.js';
import './events/ready.js';
import { REST, Routes } from 'discord.js';

// Manejar errores no controlados
process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught exception:', error);
});

// Registrar los comandos
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    // Registrar nuevos comandos globalmente
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: [registerCommand.toJSON(), helpCommand.toJSON(), setPrefixCommand.toJSON()] }
    );
    console.log('✅ Comandos registrados globalmente.');
  } catch (error) {
    console.error(error);
  }
})();

// Crear una colección de comandos
const commands = new Map();
commands.set(registerCommand.name, registerExecute);
commands.set(helpCommand.name, helpExecute);
commands.set(setPrefixCommand.name, setPrefixExecute);

// Escuchar comandos
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: '❌ Comando no reconocido.', flags: 64 });
  }

  try {
    await command(interaction);
  } catch (error) {
    console.error(`❌ Error al ejecutar el comando ${interaction.commandName}:`, error);
    await interaction.reply({ content: '❌ Hubo un error al ejecutar este comando.', flags: 64 });
  }
});

// Manejar eventos del cliente
client.on('ready', () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
});

client.on('error', error => {
  console.error('❌ Error del cliente:', error);
});

client.on('warn', warning => {
  console.warn('⚠️ Advertencia del cliente:', warning);
});

// Iniciar sesión
client.login(process.env.DISCORD_TOKEN);
console.log('☀️ Sunshine Bot está online!');


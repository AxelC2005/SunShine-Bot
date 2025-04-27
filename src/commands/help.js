import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help') // Nombre del comando
  .setDescription('Provides a list of available commands.');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🌞 SunShine Bot - Ayuda')
    .setDescription('Aquí están los comandos que puedes usar:')
    .addFields(
      { name: '/register', value: '📋 Registra tu personaje en el mundo de SunShine.' },
      { name: '/practicar', value: '🔪 Practica con cuchillos para mejorar tus habilidades.' },
      { name: '/setprefix', value: '⚙️ Cambia el prefijo de comandos (por defecto `/`).' },
    )
    .setColor('Yellow')
    .setFooter({ text: 'SunShine Bot ☀️ - ¡A brillar en el crimen!' });

  await interaction.reply({
    embeds: [embed], // Enviar el embed en la respuesta
    flags: 64 // Utiliza MessageFlags.Ephemeral (64) para respuestas efímeras
  });
}

import { SlashCommandBuilder } from 'discord.js';

// Guardaremos el prefijo en memoria
export let currentPrefix = '/'; // por defecto

export const data = new SlashCommandBuilder()
  .setName('setprefix')
  .setDescription('⚙️ Cambia el prefijo de comandos del bot.')
  .addStringOption(option =>
    option
      .setName('nuevo_prefijo')
      .setDescription('Nuevo símbolo para el prefijo (ejemplo: !, ?, .)')
      .setRequired(true)
  );

export async function execute(interaction) {
  const nuevoPrefijo = interaction.options.getString('nuevo_prefijo');

  if (nuevoPrefijo.length > 3) {
    await interaction.reply({
      content: '🚫 El prefijo no puede tener más de 3 caracteres.',
      ephemeral: true
    });
    return;
  }

  currentPrefix = nuevoPrefijo;

  await interaction.reply({
    content: `✅ Prefijo actualizado exitosamente a **${currentPrefix}**`,
    ephemeral: true
  });
}

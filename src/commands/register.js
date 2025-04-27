// src/commands/register.js
import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../supabase.js';

export const data = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Regístrate como asesino, informante o vendedor')
  .addStringOption(option =>
    option
      .setName('job')
      .setDescription('Elige tu trabajo')
      .setRequired(true)
      .addChoices(
        { name: 'Asesino', value: 'asesino' },
        { name: 'Informante', value: 'informante' },
        { name: 'Vendedor', value: 'vendedor' }
      )
  );

export async function execute(interaction) {
  const job = interaction.options.getString('job');
  const { id: discordId, username } = interaction.user;

  // Crear usuario en Supabase
  const { data, error } = await supabase.from('users').insert([
    {
      discord_id: discordId,
      username,
      job,
      stats: {
        fuerza: 1,
        cuchillos: 1,
        sigilo: 1,
        suerte: 1,
      },
    },
  ]);

  if (error) {
    if (error.code === '23505') {
      // Manejar error de clave duplicada
      return interaction.reply({
        content: '❌ Ya estás registrado.',
        flags: 64 // Respuesta efímera
      });
    }
    console.error(error);
    return interaction.reply({
      content: '❌ Error al registrarte.',
      flags: 64 // Respuesta efímera
    });
  }

  await interaction.reply({
    content: `✅ ¡Te has registrado como **${job}** exitosamente!`,
    flags: 64 
  });
}

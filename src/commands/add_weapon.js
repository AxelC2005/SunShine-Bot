const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { supabase } = require('../supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_weapon')
    .setDescription('Agrega una nueva arma al sistema (solo Admins)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Solo admins ven el comando
    .addStringOption(option => option.setName('name').setDescription('Nombre del arma').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Descripción del arma').setRequired(true))
    .addStringOption(option => option.setName('job').setDescription('Trabajo requerido').setRequired(true))
    .addIntegerOption(option => option.setName('price').setDescription('Precio del arma').setRequired(true))
    .addIntegerOption(option => option.setName('random_chance').setDescription('Chance (%) de EXP extra').setRequired(true))
    .addIntegerOption(option => option.setName('exp_base').setDescription('EXP base al usarla').setRequired(true))
    .addStringOption(option =>
      option.setName('rarity')
        .setDescription('Rareza del arma')
        .addChoices(
          { name: 'Común', value: 'common' },
          { name: 'Raro', value: 'rare' },
          { name: 'Épico', value: 'epic' },
          { name: 'Legendario', value: 'legendary' }
        )
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('obtain_method')
        .setDescription('Método de obtención')
        .addChoices(
          { name: 'Tienda', value: 'shop' },
          { name: 'Evento', value: 'event' },
          { name: 'Nivel', value: 'levelup' }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const job = interaction.options.getString('job');
    const price = interaction.options.getInteger('price');
    const randomChance = interaction.options.getInteger('random_chance');
    const expBase = interaction.options.getInteger('exp_base');
    const type = interaction.options.getString('type');
    const rarity = interaction.options.getString('rarity');
    const obtainMethod = interaction.options.getString('obtain_method');

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('items')
      .insert([{
        name,
        description,
        job, // Aquí ahora se llama job
        price,
        random_chance: randomChance,
        exp_base: expBase,
        rarity,
        obtain_method: obtainMethod
      }]);

    if (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Hubo un error al agregar el arma.', ephemeral: true });
    }

    await interaction.reply({ content: `✅ ¡Arma **${name}** agregada exitosamente!`, ephemeral: true });
  }
};

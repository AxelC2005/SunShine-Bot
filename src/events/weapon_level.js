import { EmbedBuilder } from 'discord.js';
import { supabase } from '../supabase.js';
import levelupRewards from '../data/levelupRewards.json' assert { type: "json" };

export async function handleLevelUp(user) {
  const userRole = user.job;
  const level = user.level;
  const rewardsForRole = levelupRewards[userRole];

  if (!rewardsForRole || !rewardsForRole[level]) return;

  const weaponName = rewardsForRole[level];

  // Buscar el arma por nombre y método de obtención 'levelup'
  const { data: item, error: fetchError } = await supabase
    .from('items')
    .select('id, name')
    .eq('name', weaponName)
    .eq('obtain_method', 'levelup')
    .single();

  if (fetchError || !item) {
    console.error('Error fetching weapon:', fetchError);
    return;
  }

  // Verificar si el usuario ya tiene este ítem en su inventario
  const { data: existingItem, error: checkError } = await supabase
    .from('user_inventory')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', item.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking inventory:', checkError);
    return;
  }

  if (existingItem) {
    console.log(`El usuario ${user.id} ya tiene el ítem '${weaponName}' por levelup.`);
    return;
  }

  // Insertar el ítem en el inventario del usuario
  const { error: insertError } = await supabase
    .from('user_inventory')
    .insert([{
      user_id: user.id,
      item_id: item.id,
      obtained_at: new Date().toISOString()
    }]);

  if (insertError) {
    console.error('Error assigning item:', insertError);
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🎉 ¡Has subido de nivel!')
    .setDescription(`¡Llegaste al nivel **${level}** como **${userRole}** y recibiste el arma **${item.name}**!`)
    .setColor('Green');

  try {
    await user.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error enviando DM:', err);
  }
}

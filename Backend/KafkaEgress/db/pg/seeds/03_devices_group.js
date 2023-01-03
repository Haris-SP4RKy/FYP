/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('devices_group').del()
  knex('devices_group').insert({
    name: 'gulshan',
    longitude:67.128448,
    latitude:24.929374,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.128448 24.929374)', 4326)`)
  }).then(() => {
    console.log('Insert complete!');
  });
};

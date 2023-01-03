/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('devices').del()
  await knex('devices').insert([
    {id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'carbondioxide'},
    {id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'carbonmonoxide'},
    {id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'temperature'},
    {id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'humidity'}
  ]);
};

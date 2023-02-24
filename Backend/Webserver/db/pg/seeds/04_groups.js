/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('groups').del()
  await knex('groups').insert([
    {device_id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'carbondioxide',group_id:1},
    {device_id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'carbonmonoxide',group_id:1},
    {device_id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'temperature',group_id:1},
    {device_id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'humidity',group_id:1},
    {device_id: 'f2e388e7-7a39-4871-b7c6-c5e663505dfe', sensor_type: 'temperature',group_id:1}

  ]);
};

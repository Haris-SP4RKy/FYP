/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('devices_group').del()
  knex('devices_group').insert([{
    name: 'default_gulshan',
    longitude:67.128448,
    latitude:24.929374,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.128448 24.929374)', 4326)`)
  },
  {
    name: 'default_baldia',
    longitude:66.9550,
    latitude:24.9525,
    coordinates: knex.raw(`ST_GeomFromText('POINT(66.9550 24.9525)', 4326)`)
  },
  {
    name: 'default_binqasim',
    longitude:67.4005,
    latitude:24.8596,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.4005 24.8596)', 4326)`)
  },
  {
    name: 'default_gadap',
    longitude:67.1321,
    latitude:25.0023,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.1321 25.0023)', 4326)`)
  },
  {
    name: 'default_gulberg',
    longitude:67.0760,
    latitude:24.9368,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0760  24.9368)', 4326)`)
  },
  {
    name: 'default_jamshed',
    longitude:67.0524,
    latitude:24.8702,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0524 24.8702)', 4326)`)
  },
  {
    name: 'default_kiamari',
    longitude:66.8790,
    latitude:24.8788,
    coordinates: knex.raw(`ST_GeomFromText('POINT(66.8790 24.8788)', 4326)`)
  },
  {
    name: 'default_korangi',
    longitude:67.1209,
    latitude:24.8387,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.1209 24.8387)', 4326)`)
  },
  {
    name: 'default_landhi',
    longitude:67.1948,
    latitude:24.8406,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.1948 24.8406)', 4326)`)
  },
  {
    name: 'default_liaquatabad',
    longitude:67.0311,
    latitude:24.929374,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0311 24.9107)', 4326)`)
  },
  {
    name: 'default_lyari',
    longitude:67.0103,
    latitude:24.8784,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0311 24.8784)', 4326)`)
  },
  {
    name: 'default_malir',
    longitude:67.2163,
    latitude:24.8937,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.2163 24.8937)', 4326)`)
  },
  {
    name: 'default_northnazimabad',
    longitude:67.0423,
    latitude:24.9372,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0423 24.9372)', 4326)`)
  },
  {
    name: 'default_orangi',
    longitude:67.0023,
    latitude:24.9517,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0023 24.9517)', 4326)`)
  },
  {
    name: 'default_saddar',
    longitude:67.0167,
    latitude:24.8532,
    coordinates: knex.raw(`ST_GeomFromText('POINT(67.0167 24.8532)', 4326)`)
  },
  {
    name: 'default_site',
    longitude:66.9928,
    latitude:24.9053,
    coordinates: knex.raw(`ST_GeomFromText('POINT(66.9928 24.9053)', 4326)`)
  },
]).then(() => {
    console.log('Insert complete!');
  });
};

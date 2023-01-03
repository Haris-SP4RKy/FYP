/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
	await knex.raw('CREATE EXTENSION IF NOT EXISTS postgis');
	await knex.raw('CREATE EXTENSION IF NOT EXISTS postgis_topology');
	// await knex.raw('CREATE EXTENSION postgis_tiger_geocoder');


	// await knex.schema
	// 	.createTable('data', function (table) {
	// 		table.increments('id');
	// 		table.text('deviceId');
	// 		// table.text('CO2');
	// 		// table.text('CO');
	// 		// table.text('airQuality');
	// 		// table.text('long');
	// 		// table.text('lat');
	// 		table.binary('data');
	// 		table.index(['deviceId']);
	// 		// table.index(['long', 'lat']);
	// 		table.timestamps(true, true).notNull();
	// 	});
        await knex.schema
		.createTable('users', (table) => {
			table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('name');
			table.text('email').unique();
			table.text('password');
			table.text('avatar').defaultTo('https://i.imgur.com/Xq2bZCY.png');
			table.text('bio').defaultTo('I am a new user');

			table.index(['email']);
			table.timestamps(true, true);
		});


	await knex.schema
	.createTable('devices', function (table) {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
		table.text('sensor_type');
		table.primary(['id','sensor_type']);
		table.timestamps(true, true);
	});

	await knex.schema
	.createTable('sensor_data', function (table) {
		table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('device_id');
		table.text('sensor_type');
		table.binary('data');
		table.index(['device_id']);
		// table.text('latitude');
		// table.text('longitude');
		// table.index(['long', 'lat']);
		table.timestamps(true, true);
		table.foreign(['device_id','sensor_type'])
        .references(['id','sensor_type'])
        .on('devices').onDelete('CASCADE');

	});
	await knex.schema
	.createTable('devices_group', function (table) {
		table.increments('id').primary();
		table.text('name');
		table.float('latitude');
		table.float('longitude');
		table.specificType('coordinates', 'geometry');
		table.timestamps(true, true);
	});
	await knex.schema
	.createTable('groups', function (table) {
		table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('device_id');
		table.text('sensor_type');
		table.integer('group_id').references('id').inTable('devices_group').onDelete('CASCADE');
		table.index(['device_id']);
		table.foreign(['device_id','sensor_type'])
        .references(['id','sensor_type'])
        .on('devices').onDelete('CASCADE');
		table.timestamps(true, true);
	});

	await knex.schema
	.createTable('user_access', function (table) {
		table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');;
		table.integer('group_id').references('id').inTable('devices_group').onDelete('CASCADE');
		table.timestamps(true, true);
	});
	
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) =>{
	await knex.schema.dropTable('user_access');
	await knex.schema.dropTable('groups');
	await knex.schema.dropTable('devices_group');
	await knex.schema.dropTable('sensor_data');

	await knex.schema.dropTable('users');
    await knex.schema.dropTable('devices');
};

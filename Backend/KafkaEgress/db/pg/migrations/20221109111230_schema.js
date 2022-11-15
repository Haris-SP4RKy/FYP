/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
	// await knex.schema
	// 	.createTable('data', function (table) {
	// 		table.increments('id');
	// 		table.text('deviceId').notNullable();
	// 		// table.text('CO2');
	// 		// table.text('CO');
	// 		// table.text('airQuality');
	// 		// table.text('long');
	// 		// table.text('lat');
	// 		table.binary('data').notNullable();
	// 		table.index(['deviceId']);
	// 		// table.index(['long', 'lat']);
	// 		table.timestamps(true, true).notNull();
	// 	});
        await knex.schema
		.createTable('users', (table) => {
			table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('name').notNullable();
			table.text('email').notNullable().unique();
			table.text('password').notNullable();
			table.text('avatar').defaultTo('https://i.imgur.com/Xq2bZCY.png');
			table.text('bio').defaultTo('I am a new user');

			table.index(['email']);
			table.timestamps(true, true).notNull();
		});


	await knex.schema
	.createTable('devices', function (table) {
		table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.text('device_serial').notNullable();
		table.text('sensor_type');
		table.index(['deviceId']);
		table.timestamps(true, true).notNull();
	});

	await knex.schema
	.createTable('sensor_data', function (table) {
		table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.text('device_id').notNullable().references('device_serial').inTable('devices').onDelete('CASCADE');
		table.text('sensor_type');
		table.binary('data').notNullable();
		table.index(['device_id']);
		// table.index(['long', 'lat']);
		table.timestamps(true, true).notNull();
	});
	await knex.schema
	.createTable('devices_group', function (table) {
		table.increments('id').primary();
		table.text('name').notNullable();
		table.text('latitude').notNullable();
		table.text('longitude').notNullable();
		table.timestamps(true, true).notNull();
	});
	await knex.schema
	.createTable('groups', function (table) {
		table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.text('device_id').notNullable().references('device_serial').inTable('devices').onDelete('CASCADE');
		table.text('group_id').notNullable().references('id').inTable('devices_group').onDelete('CASCADE');
		table.index(['device_id']);
		table.timestamps(true, true).notNull();
	});

	await knex.schema
	.createTable('user_access', function (table) {
		table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.text('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');;
		table.text('group_id').notNullable().references('id').inTable('devices_group').onDelete('CASCADE');
		table.timestamps(true, true).notNull();
	});
	
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) =>{
	await knex.schema.dropTable('users');
    await knex.schema.dropTable('data');
};

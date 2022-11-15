/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
	await knex.schema
		.createTable('data', function (table) {
			table.increments('id');
			table.text('deviceId').notNullable();
			// table.text('CO2');
			// table.text('CO');
			// table.text('airQuality');
			// table.text('long');
			// table.text('lat');
			table.binary('data').notNullable();
			table.index(['deviceId']);
			// table.index(['long', 'lat']);
			table.timestamps(true, true).notNull();
		});
        await knex.schema
		.createTable('users', (table) => {
			table.increments('id').primary();
			table.text('name').notNullable();
			table.text('email').notNullable();
			table.text('password').notNullable();
			table.text('avatar').defaultTo('https://i.imgur.com/Xq2bZCY.png');
			table.text('bio').defaultTo('I am a new user');

			table.index(['email']);
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

const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Reservations').del();

  const customers = await knex('Customers').pluck('customer_id');
  const reservations = [];

  for (let i = 0; i < 30; i++) {
    reservations.push({
      customer_id: faker.helpers.arrayElement(customers),
      reservation_date: faker.date.future(),
      number_of_people: faker.number.int({ min: 1, max: 10 }), // Updated method
      table_number: faker.number.int({ min: 1, max: 20 }), // Updated method
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled'])
    });
  }

  await knex('Reservations').insert(reservations);
};

const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Order_Details').del(); // Delete order details first
  await knex('Orders').del(); // Then delete orders
  await knex('Reservations').del(); // Delete reservations before customers
  await knex('Customers').del(); // Finally delete customers

  const customers = [];

  for (let i = 0; i < 100; i++) {
    customers.push({
      full_name: faker.name.fullName(),      
      phone_number: faker.phone.number(),   
      email: faker.internet.email(),         
      address: faker.address.streetAddress(),
      registered_at: faker.date.past()       
    });
  }

  await knex('Customers').insert(customers);
};

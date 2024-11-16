const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Reviews').del();

  const customers = await knex('Customers').pluck('customer_id');
  const reviews = [];

  for (let i = 0; i < 50; i++) {
    reviews.push({
      customer_id: faker.helpers.arrayElement(customers),
      review_text: faker.lorem.sentence(),
      rating: faker.number.int({ min: 1, max: 5 }), // Reverted to previous method
      created_at: faker.date.recent()
    });
  }

  await knex('Reviews').insert(reviews);
};

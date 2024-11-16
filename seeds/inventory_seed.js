const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Inventory').del();

  const inventory = [];

  for (let i = 0; i < 50; i++) {
    inventory.push({
      item_name: faker.commerce.productMaterial(),
      quantity: Math.floor(Math.random() * (200 - 10 + 1)) + 10, // Updated here
      unit: 'kg', // Bạn có thể thay đổi thành các đơn vị khác
      restocked_at: faker.date.past()
    });
  }

  await knex('Inventory').insert(inventory);
};

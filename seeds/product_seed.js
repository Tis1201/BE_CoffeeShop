const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Products').del();

  const categories = ['Coffee', 'Tea', 'Snack', 'Dessert'];
  const products = [];

  for (let i = 0; i < 50; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(1, 20, 2),
      category: faker.helpers.arrayElement(categories),
      product_img: faker.image.url()
    });
  }

  await knex('Products').insert(products);
};

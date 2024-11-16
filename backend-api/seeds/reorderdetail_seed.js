const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Order_Details').del();

  // Lấy danh sách order_id và product_id từ bảng Orders và Products
  const orders = await knex('Orders').pluck('order_id');
  const products = await knex('Products').pluck('product_id');

  const orderDetails = [];

  for (let i = 0; i < 200; i++) {
    orderDetails.push({
      order_id: faker.helpers.arrayElement(orders),
      product_id: faker.helpers.arrayElement(products),
      quantity: faker.number.int({ min: 1, max: 5 }), // Updated to faker.number.int
      price: faker.commerce.price(1, 20, 2)
    });
  }

  await knex('Order_Details').insert(orderDetails);
};

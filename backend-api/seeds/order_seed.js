const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Orders').del();

  // Lấy danh sách customer_id và employee_id từ bảng Customers và Employees
  const customers = await knex('Customers').pluck('customer_id');
  const employees = await knex('Employees').pluck('employee_id');

  const orders = [];
  const paymentMethods = ['cash', 'card', 'mobile'];

  for (let i = 0; i < 100; i++) {
    orders.push({
      customer_id: faker.helpers.arrayElement(customers),
      employee_id: faker.helpers.arrayElement(employees),
      order_date: faker.date.recent(),
      total_price: faker.commerce.price(5, 100, 2),
      payment_method: faker.helpers.arrayElement(paymentMethods)
    });
  }

  await knex('Orders').insert(orders);
};

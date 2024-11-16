const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Employees').del();

  const employees = [];
  const roles = ['Barista', 'Waiter', 'Manager', 'Cashier'];

  for (let i = 0; i < 20; i++) {
    employees.push({
      full_name: faker.name.fullName(),
      role: faker.helpers.arrayElement(roles),
      phone_number: faker.phone.number(),
      email: faker.internet.email(),
      hire_date: faker.date.past(5) // Hired within the last 5 years
    });
  }

  await knex('Employees').insert(employees);
};

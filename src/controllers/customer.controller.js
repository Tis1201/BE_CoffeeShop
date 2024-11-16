const customerService = require("../services/customer.service");
const jsend = require("../jsend");


module.exports = {
  Register: async (req, res) => {
    try {
      const result = await customerService.register({ ...req.body });
      return res.status(201).json(jsend.success({ customer: result.customer, accessToken: result.accessToken }));
    } catch (err) {
      return res.status(400).json(jsend.error({ error: err.message }));
    }
  },

  Login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await customerService.login(email, password);
      return res.json(jsend.success({ customer: result.customer, accessToken: result.accessToken }));
    } catch (err) {
      return res.status(401).json(jsend.error({ error: err.message }));
    }
  },



  GetAllCustomer: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const result = await customerService.GetAllCustomer(page, limit);
      return res.json(jsend.success({ customers: result }));
    } catch (err) {
      return res.status(500).json(jsend.error({ error: err.message }));
    }
  },

  GetCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await customerService.GetCustomerById(id);
      return res.json(jsend.success({ customer: result }));
    } catch (err) {
      return res.status(404).json(jsend.error({ error: err.message }));
    }
  },

  UpdateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = req.body;
      const result = await customerService.UpdateCustomer(id, customer);
      return res.json(jsend.success({ customer: result }));
    } catch (err) {
      return res.status(400).json(jsend.error({ error: err.message }));
    }
  },

  DeleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      await customerService.DeleteCustomer(id);
      return res.json(jsend.success({ message: "Customer deleted successfully" }));
    } catch (err) {
      return res.status(500).json(jsend.error({ error: err.message }));
    }
  },

  DeleteAllCustomer: async (req, res) => {
    try {
      await customerService.DeleteAllCustomer();
      return res.json(jsend.success({ message: "All customers deleted successfully" }));
    } catch (err) {
      return res.status(500).json(jsend.error({ error: err.message }));
    }
  },
};

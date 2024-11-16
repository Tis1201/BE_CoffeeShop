const orderItemsService = require('../services/order.service'); // Replace with the combined service file
const jsend = require("../jsend");

module.exports = {
    getAllOrderItems: async (req, res) => {
        const { page, limit } = req.query;
        const { customer_id } = req.user;
        try {
            const orderItems = await orderItemsService.getAllOrderItems(page, limit, customer_id);
            return res.json(jsend.success({ orderItems }));
        } catch (err) {
            res.status(500).json(jsend.error({ error: err.message }));
        }
    },

    getAllOrderItemsAdmin: async (req, res) => {
        const { page, limit } = req.query;
        try {
            const orderItems = await orderItemsService.getAllOrderItemsAdmin(page, limit);
            return res.json(jsend.success({ orderItems }));
        } catch (err) {
            res.status(500).json(jsend.error({ error: err.message }));
        }
    },  

    createOrderItem: async (req, res) => {
        if (!req.body) {
            return res.status(400).json(jsend.error({ error: "No data provided" }));
        }
        try {
            const orderItem = await orderItemsService.createOrderItem({ ...req.body });
            return res.json(jsend.success({ orderItem }));
        } catch (err) {
            return res.status(400).json(jsend.error({ error: err.message }));
        }
    },

    getOrderItemById: async (req, res) => {
        const { id } = req.params;
        try {
            const orderItem = await orderItemsService.getOrderItemById(id);
            return res.json(jsend.success({ orderItem }));
        } catch (err) {
            return res.status(500).json(jsend.error({ error: err.message }));
        }
    },

    deleteAllOrderItems: async (req, res) => {
        try {
            await orderItemsService.deleteAllOrderItems();
            return res.json(jsend.success({ message: "Deleted all order items successfully." }));
        } catch (err) {
            res.status(500).json(jsend.error({ error: err.message }));
        }
    },

    updateOrderItem: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedOrderItem = await orderItemsService.updateOrderItem(id, { ...req.body });
            return res.json(jsend.success({ orderItem: updatedOrderItem }));
        } catch (err) {
            return res.status(500).json(jsend.error({ error: err.message }));
        }
    },

    deleteOrderItemById: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedOrderItem = await orderItemsService.deleteOrderItemById(id);
            return res.json(jsend.success({ orderItem: deletedOrderItem }));
        } catch (err) {
            return res.status(500).json(jsend.error({ error: err.message }));
        }
    }
};

const knex = require('../config/database/knex');
const Paginator = require('./paginator');
const Joi = require('joi');

class OrderItemsService {
    constructor() {
        this.knex = knex;
    }

    orderItemsRepository() {
        return this.knex('orderitems');
    }

    readOrderItem(payload) {
        return {
            customer_id: payload.customer_id,
            order_date: payload.order_date,
            payment_method: payload.payment_method,
            product_id: payload.product_id,
            quantity: payload.quantity,
            price: payload.price,
            total_price: payload.total_price,
            status: payload.status
        };
    }


    orderItemSchema() {
        return Joi.object({
            customer_id: Joi.number().required(),
            order_date: Joi.date(),
            payment_method: Joi.string().required(),
            product_id: Joi.number().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required(),
            total_price: Joi.number().required(),
            status: Joi.boolean().required()
        });
    }

    async createOrderItem(orderItem) {
        const { error } = this.orderItemSchema().validate(orderItem);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const itemData = this.readOrderItem(orderItem);
        const [id] = await this.orderItemsRepository().insert(itemData).returning('*');
        return { id, ...itemData };
    }

    async getAllOrderItems(page, limit, userId) {
        const paginator = new Paginator(page, limit);
        const totalRecord = await this.orderItemsRepository()
        .where({ customer_id: userId, status: 0 })
        .count('order_item_id as count')
        .first();

        const metadata = paginator.getMetadata(totalRecord.count);
    
        const orderItems = await this.orderItemsRepository()
            .select('orderitems.*', 'products.name as product_name')
            .join('products', 'orderitems.product_id', 'products.product_id')
            .where({ 'orderitems.customer_id': userId, 'orderitems.status': 0 })
            .offset(paginator.offset)
            .limit(paginator.limit);
        return {
            metadata,
            orderItems
        };
    }
    
    async getAllOrderItemsAdmin(page, limit) {
        const paginator = new Paginator(page, limit);
        const totalRecord = await this.orderItemsRepository()
        .count('order_item_id as count')
        .first();

        const metadata = paginator.getMetadata(totalRecord.count);
    
        const orderItems = await this.orderItemsRepository()
            .select('orderitems.*', 'products.name as product_name')
            .join('products', 'orderitems.product_id', 'products.product_id')
            .offset(paginator.offset)
            .limit(paginator.limit);
        return {
            metadata,
            orderItems
        };
    }

    async deleteAllOrderItems() {
        await this.orderItemsRepository().del();
    }

    async deleteOrderItemById(id) {
        const orderItem = await this.orderItemsRepository().where('order_item_id', id).first();
        if (!orderItem) {
            return null;
        }
        await this.orderItemsRepository().where('order_item_id', id).del();
        return orderItem;
    }

    async updateOrderItem(id, payload) {
        // const { error } = this.orderItemSchema().validate(payload);
        // if (error) {
        //     throw new Error(error.details[0].message);
        // }
        const orderItem = await this.orderItemsRepository().where('order_item_id', id).first();
        if (!orderItem) {
            return null;
        }
        await this.orderItemsRepository().where('order_item_id', id).update(payload);
        return { ...orderItem, ...payload };
    }

    async getOrderItemById(id) {
        return this.orderItemsRepository().where('order_item_id', id).first();
    }
}

module.exports = new OrderItemsService();

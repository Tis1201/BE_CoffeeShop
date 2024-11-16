const router = require('express').Router();
const orderItemsController = require('../controllers/order.controller'); // Replace with the combined controller
const authMiddleware = require("../middleware/authentication.middleware")
module.exports = (app) => {
    app.use('/api/v1/order_items', router);

/**
 * @swagger
 * /api/v1/order_items:
 *   get:
 *     summary: Retrieve a list of order items
 *     description: Retrieve a list of all order items, with optional filters and pagination.
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *         description: Filter order items by customer ID
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filter order items by product ID
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/pageParam'
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: A list of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderItem'
 *                     metadata:
 *                       $ref: '#/components/schemas/PaginationMetadata'
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, orderItemsController.getAllOrderItems);
router.get('/admin', authMiddleware, orderItemsController.getAllOrderItemsAdmin);
/**
 * @swagger
 * /api/v1/order_items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     description: Retrieve details of a specific order item by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the order item
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: Order item details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 result:
 *                   type: object
 *                   properties:
 *                     order_item:
 *                       $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, orderItemsController.getOrderItemById);

/**
 * @swagger
 * /api/v1/order_items:
 *   post:
 *     summary: Create a new order item
 *     description: Adds a new order item to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     tags:
 *       - Order Items
 *     responses:
 *       201:
 *         description: New order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_item:
 *                       $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, orderItemsController.createOrderItem);

/**
 * @swagger
 * /api/v1/order_items/{id}:
 *   put:
 *     summary: Update an existing order item
 *     description: Updates the details of an order item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order item to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_item:
 *                       $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authMiddleware, orderItemsController.updateOrderItem);

/**
 * @swagger
 * /api/v1/order_items/{id}:
 *   delete:
 *     summary: Delete an order item
 *     description: Deletes an order item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order item to delete
 *         schema:
 *           type: integer
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: Confirmation of deletion
 *                   example: "Order item has been deleted"
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, orderItemsController.deleteOrderItemById);

/**
 * @swagger
 * /api/v1/order_items:
 *   delete:
 *     summary: Delete all order items
 *     description: Deletes all order items from the database.
 *     tags:
 *       - Order Items
 *     responses:
 *       200:
 *         description: All order items deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: Confirmation of deletion
 *                   example: "All order items have been deleted"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "An error occurred while deleting order items"
 */
router.delete('/', authMiddleware, orderItemsController.deleteAllOrderItems)
};

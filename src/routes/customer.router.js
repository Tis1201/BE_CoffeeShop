const customerController = require('../controllers/customer.controller');
const router = require('express').Router();
const authMiddleware = require("../middleware/authentication.middleware")
module.exports = (app) => {
    app.use('/api/customers', router);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     tags:
 *       - customers
 *     responses:
 *       201:
 *         description: A new customer created successfully
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
 *                     customer:
 *                       $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/register', customerController.Register);

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     summary: Login a customer
 *     description: Login a customer
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string 
 *     tags:    
 *       - customers
 *     responses:
 *       200:
 *         description: Login successfully
 *       401:   
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', customerController.Login);
/**
 * @swagger
 * /api/customers:
 *  get:
 *      summary: Retrieve a list of customers
 *      description: Get a list of customers with optional pagination
 *      tags:
 *          - customers
 *      parameters:
 *          -   $ref: '#/components/parameters/limitParam'
 *          -   $ref: '#/components/parameters/pageParam'
 *      responses:
 *          200:
 *              description: A list of customers
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  description: The response status
 *                                  enum: [success]
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      customers:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/Customer'
 *                                      metadata:
 *                                          $ref: '#/components/schemas/PaginationMetadata'
 *          400:
 *              description: Invalid request parameters
 *          500:
 *              description: Internal server error
 */
router.get('/', authMiddleware, customerController.GetAllCustomer);
/**
 * @swagger
 * /api/customers:
 *   delete:
 *     summary: Delete all customers
 *     description: Deletes all customer records from the database
 *     tags:
 *       - customers
 *     responses:
 *       204:
 *         description: All customers deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/',authMiddleware, customerController.DeleteAllCustomer);
/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     description: Get a single customer record by ID
 *     tags:
 *       - customers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single customer
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
 *                     customer:
 *                       $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, customerController.GetCustomerById);
/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     description: Update an existing customer record by ID
 *     tags:
 *       - customers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated successfully
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
 *                     customer:
 *                       $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, customerController.UpdateCustomer);
/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     description: Deletes a customer record by ID
 *     tags:
 *       - customers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', authMiddleware, customerController.DeleteCustomer);
}

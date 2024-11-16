const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/product.router');
const orderRouter = require('./routes/order.router');
const customerRouter = require('./routes/customer.router');
const path = require('path');

const { specs, swaggerUi } = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/public', express.static('public'));
productRouter(app);

orderRouter(app);
customerRouter(app);
module.exports = app;
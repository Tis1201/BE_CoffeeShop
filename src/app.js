const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/product.router');
const orderRouter = require('./routes/order.router');
const customerRouter = require('./routes/customer.router');
const path = require('path');

const { specs, swaggerUi } = require('./docs/swagger');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // URL frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
  };
  
  // Sử dụng CORS với tùy chọn
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/public', express.static('public'));
productRouter(app);

orderRouter(app);
customerRouter(app);
module.exports = app;
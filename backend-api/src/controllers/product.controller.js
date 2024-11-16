const productService = require('../services/product.service');
const path = require('path');
const jsend = require('../jsend');

module.exports = {
    getAllProducts: async (req, res) => {
        const {page, limit} = req.query;
        const products = await productService.getAllProducts(page, limit);
        return res.json(jsend.success({ products }));
    },
    getProductById: async (req, res) => {
        const {id} = req.params;
        const product = await productService.getProductById(id);
        return res.json(jsend.success({ product }));
    },
    createProduct: async (req, res) => {
        if (!req.body) {
            return res.status(400).json({error: 'No data provided'});
        }
        try {
            const productImgPath = req.file ? path.join('/public/uploads', req.file.filename) : null;
            const product = await productService.createProduct({...req.body, product_img: productImgPath});
            res.json(jsend.success({ product: product }));
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    updateProduct: async (req, res) => {
        const {id} = req.params;
        try {
            const product = await productService.updateProduct(id, {...req.body, 
                product_img: req.file ? path.join('/public/uploads', req.file.filename) : null
            });
            return res.json(jsend.success({product: product}));
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },
    deleteProduct: async (req, res) => {
        const {id} = req.params;
        try {
            await productService.deleteProduct(id); 
            return res.json(jsend.success({ message: 'Product delete successfully'}));
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    },   


    searchProductByCategory: async (req, res) => {
        const { page, limit } = req.query;
        const { category } = req.params;
        const { name } = req.query;

        if (!category) {
            return res.status(400).json(jsend.error('Category is required'));
        }
        try {
            const product = await productService.searchProductbyCate(page, limit, category, name);
            return res.json(jsend.success({ product }));
        } catch (error) {
            console.error('error searching', error);
            return res.status(500).json(jsend.error('Error searching'));
        }
    }
}   

const knex = require("../config/database/knex");
const Paginator = require("./paginator");
const { unlink } = require("fs");
const Joi = require("joi");
class ProductService {
  constructor() {
    this.knex = knex;
  }

  productRepository() {
    return this.knex("products");
  }

  readProduct(payload) {
    return {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      product_img: payload.product_img,
    };
  }
  getProductValidationSchema() {
    return Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
    });
  }

  async getAllProducts(page, limit) {
    const paginator = new Paginator(page, limit);
    const totalRecords = await this.productRepository()
      .count("product_id as count")
      .first();
    const metadata = paginator.getMetadata(totalRecords.count);
    const products = await this.productRepository()
      .select("product_id", "name", "price", "description", "product_img")
      .offset(paginator.offset)
      .limit(paginator.limit);

    return {
      metadata,
      products,
    };
  }

  async getProductById(id) {
    const product = await this.productRepository()
      .where("product_id", id)
      .first();
    return product;
  }

  async createProduct(productData) {
    // const {error} = this.getProductValidationSchema().validate(productData);
    // if (error) {
    //     throw new Error(error.details[0].message);
    // }
    const product = this.readProduct(productData);
    const [id] = await this.productRepository().insert(product);
    return { id, ...product };
  }

  async updateProduct(product_id, payload) {
    const updateProduct = await this.productRepository()
      .where("product_id", product_id)
      .select("*")
      .first();
    if (!updateProduct) {
      return null;
    }
    const update = this.readProduct(payload);
    if (!update.product_img) {
      delete update.product_img;
    }
    await this.productRepository()
      .where("product_id", product_id)
      .update(update);
    if (
      update.product_img &&
      updateProduct.product_img &&
      update.product_img !== updateProduct.product_img &&
      updateProduct.product_img.startsWith("/public/uploads")
    ) {
      unlink(`.${updateProduct.product_img}`, (err) => {});
    }
    return { ...updateProduct, ...update };
  }

  async deleteProduct(product_id) {
    const deleteProduct = await this.productRepository()
      .where("product_id", product_id)
      .select("product_img")
      .first();
    if (!deleteProduct) {
      return null;
    }
    await this.productRepository().where("product_id", product_id).del();
    if (
      deleteProduct.product_img &&
      deleteProduct.product_img.startsWith("/public/uploads")
    ) {
      unlink(`.${deleteProduct.product_img}`, (err) => {});
    }
    return deleteProduct;
  }

  async searchProductbyCate(page, limit, category, name) {
    if(category === 'All'){
      category = '';
    }
    const query = this.productRepository().where(
      "category",
      "like",
      `%${category}%`
    );
    const paginator = new Paginator(page, limit);

    if (name) {
      query.andWhere("name", "like", `%${name}%`);
    }

    const totalRecords = await query
      .clone()
      .count("product_id as count")
      .first();

    const products = await query
      .offset(paginator.offset)
      .limit(paginator.limit);

    const metadata = paginator.getMetadata(totalRecords.count);

    return {
      metadata,
      products,
    };
  }
}
module.exports = new ProductService();

const knex = require("../config/database/knex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Paginator = require("./paginator");

class CustomerService {
  constructor() {
    this.knex = knex;
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key"; // Replace with your secret
    this.jwtExpiry = process.env.JWT_EXPIRY || "1h"; // Token expiry
    this.saltRounds = 10; // For bcrypt hashing
  }

  CustomerRepository() {
    return this.knex("customers");
  }

  readCustomer(payload) {
    return {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      address: payload.address,
      role: payload.role,
    };
  }

  CustomerValidation() {
    return Joi.object({
      full_name: Joi.string().required(),
      phone_number: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      address: Joi.string().required(),
      role: Joi.boolean().required(),
    });
  }

  async hashPassword(password) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async validatePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  generateAccessToken(customer) {
    return jwt.sign(
      {
        customer_id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        role: customer.role,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );
  }

  async register(customer) {
    const { error } = this.CustomerValidation().validate(customer);
    if (error) {
      throw new Error(error.message);
    }

    // Check if email already exists
    const existingCustomer = await this.CustomerRepository()
      .where("email", customer.email)
      .first();
    if (existingCustomer) {
      throw new Error("Email is already in use.");
    }

    const hashedPassword = await this.hashPassword(customer.password);
    const customerData = {
      ...this.readCustomer(customer),
      password: hashedPassword,
    };

    const [id] = await this.CustomerRepository().insert(customerData);
    const savedCustomer = { id, ...customerData };

    // Generate tokens
    const accessToken = this.generateAccessToken({
      customer_id: id,
      full_name: customer.full_name,
      email: customer.email,
      role: customer.role,
    });

    const refreshToken = this.generateRefreshToken({
      customer_id: id,
      full_name: customer.full_name,
      email: customer.email,
      role: customer.role,
    });

    const refreshTokenExpires = this.getRefreshTokenExpiration();

    // Debug tokens
    console.log({ refreshToken, refreshTokenExpires });

    // Update customer record with refresh token and expiration
    await this.CustomerRepository()
      .where("customer_id", id)
      .update({
        refreshToken: refreshToken || null,
        refreshTokenExpires: refreshTokenExpires || null,
      });

    return { customer: savedCustomer, accessToken, refreshToken };
  }

  async login(email, password) {
    const customer = await this.CustomerRepository()
      .where("email", email)
      .first();

    if (!customer) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await this.validatePassword(
      password,
      customer.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // Generate tokens
    const accessToken = this.generateAccessToken({
      customer_id: customer.customer_id,
      full_name: customer.full_name,
      email: customer.email,
      role: customer.role,
    });

    const refreshToken = this.generateRefreshToken({
      customer_id: customer.customer_id,
      full_name: customer.full_name,
      email: customer.email,
      role: customer.role,
    });

    const refreshTokenExpires = this.getRefreshTokenExpiration();

    // Debug tokens
    console.log({ refreshToken, refreshTokenExpires });

    // Update customer record with refresh token and expiration
    await this.CustomerRepository()
      .where("customer_id", customer.customer_id)
      .update({
        refreshToken: refreshToken || null,
        refreshTokenExpires: refreshTokenExpires || null,
      });

    return { customer: this.readCustomer(customer), accessToken, refreshToken };
  }

  getRefreshTokenExpiration() {
    const now = new Date();
    now.setDate(now.getDate() + 7); // Token valid for 7 days
    return now;
  }

  generateRefreshToken(customer) {
    const secret =
      process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret"; // Replace with your secret
    const expiry = "7d"; // Set refresh token expiry, e.g., 7 days

    return jwt.sign(
      {
        customer_id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        role: customer.role,
      },
      secret,
      { expiresIn: expiry }
    );
  }

  async GetAllCustomer(page, limit) {
    const paginator = new Paginator(page, limit);
  
    const totalRecord = await this.CustomerRepository()
      .count("customer_id as count")
      .first();
  
    if (!totalRecord || !totalRecord.count) {
      return { metadata: paginator.getMetadata(0), customers: [] };
    }
  
    const metadata = paginator.getMetadata(totalRecord.count);
  
    const customers = await this.CustomerRepository()
      .select("customer_id", "full_name", "phone_number", "email", "address", "role")
      .offset(paginator.offset)
      .limit(paginator.limit);
  
    return { metadata, customers };
  }
  

  async GetCustomerById(id) {
    const customer = await this.CustomerRepository()
      .where("customer_id", id)
      .select("customer_id", "full_name", "phone_number", "email", "address")
      .first();
    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  async UpdateCustomer(id, customer) {
    const { error } = this.CustomerValidation().validate(customer);
    if (error) {
      throw new Error(error.message);
    }

    const customerData = this.readCustomer(customer);
    await this.CustomerRepository()
      .where("customer_id", id)
      .update(customerData);
    return { id, ...customerData };
  }

  async DeleteCustomer(id) {
    await this.CustomerRepository().where("customer_id", id).delete();
  }

  async DeleteAllCustomer() {
    await this.CustomerRepository().delete();
  }
}

module.exports = new CustomerService();

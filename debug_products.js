const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const checkProducts = async () => {
    const products = await Product.find({});
    console.log('Total Products:', products.length);
    products.forEach(p => {
        console.log(`- ${p.name} (Image: ${p.image})`);
    });
    process.exit();
};

checkProducts();

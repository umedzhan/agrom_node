const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env') });
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

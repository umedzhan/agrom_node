const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const verifyAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log(`Admin user found: ${user.name}`);
            // Check if isAdmin is true
            if (user.isAdmin) {
                console.log('User is Admin');
            } else {
                console.log('User exists but isAdmin is false. Fixing...');
                user.isAdmin = true;
                await user.save();
                console.log('User promoted to Admin.');
            }

            // Optional: You could reset password here if you wanted to be 100% sure
            user.password = '123456';
            await user.save();
            console.log('Admin password reset to 123456 to ensure access.');

        } else {
            console.log('Admin user NOT found. Creating...');
            const newAdmin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: '123456',
                isAdmin: true,
            });
            console.log(`Admin user created: ${newAdmin.email} / 123456`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

verifyAdmin();

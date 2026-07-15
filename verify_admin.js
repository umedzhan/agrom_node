const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Maintenance script: ensures an admin account exists / is promoted.
// Requires ADMIN_EMAIL and ADMIN_PASSWORD to be set explicitly so nobody can
// accidentally reset a real admin's password to a hardcoded, guessable value
// by running this against a production MONGO_URI.
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const verifyAdmin = async () => {
    if (!adminEmail || !adminPassword) {
        console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running this script.');
        process.exit(1);
    }
    if (adminPassword.length < 6) {
        console.error('ADMIN_PASSWORD must be at least 6 characters.');
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log(`Admin user found: ${user.name}`);
            if (!user.isAdmin) {
                user.isAdmin = true;
                console.log('Promoting user to Admin...');
            }
            user.password = adminPassword;
            await user.save();
            console.log('Admin password updated.');
        } else {
            const newAdmin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                isAdmin: true,
            });
            console.log(`Admin user created: ${newAdmin.email}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

verifyAdmin();

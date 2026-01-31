const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(require('helmet')());
app.use(require('express-mongo-sanitize')());

// Connect to Database
connectDB();

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

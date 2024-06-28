const User = require('../models/userr');
const Item = require('../models/item');
const Cart = require('../models/cart');
const Order = require('../models/order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const addToBlacklist  = require('../middlewares/tokenmiddleware'); 

exports.cleanupController = async (req, res) => {
    try {
      // Delete all documents in each collection
      await Cart.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      await Order.deleteMany({});
  
      // Send a success response
      res.status(200).json({ message: 'All documents deleted successfully' });
    } catch (error) {
      // Send an error response if something goes wrong
      res.status(500).json({ message: 'Error deleting documents', error: error.message });
    }
  };

// User signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, isSeller, businessName, businessAddress, phoneNumber, businessDescription, Image } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isSeller,
            businessName,
            businessAddress,
            phoneNumber,
            businessDescription,
            Image
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, email: user.email, isSeller: user.isSeller },
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, userId: user._id, isSeller: user.isSeller });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// User logout
exports.logout = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    addToBlacklist(token);
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.verifyToken = (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required.');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.status(200).json({ message: 'Valid token' });
    } catch (error) {
        res.status(401).send('Invalid token.');
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getTotalSales = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find all orders for the specified seller (user)
        const orders = await Order.find({ seller: userId });

        // Calculate the total quantity sold
        const totalSales = orders.reduce((acc, order) => {
            return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);

        res.status(200).json({ totalSales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

exports.getProductListed = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find all items for the specified seller (user)
        const items = await Item.find({ seller: userId });

        // Calculate the total quantity of products listed
        const totalListed = items.reduce((acc, item) => acc + item.quantity, 0);

        res.status(200).json({ totalListed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


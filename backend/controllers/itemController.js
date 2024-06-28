const Item = require('../models/item');
const Cart = require('../models/cart');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.addItem = async (req, res) => {
    try {
        const { name, description, price, quantity, category, seller } = req.body;
        const productImage = req.files ? req.files.productImage : null;

        if (!name || !price || !quantity || !category || !seller) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        if (!productImage) {
            return res.status(400).json({ message: 'No product image uploaded.' });
        }

        // Validate the file type
        const fileType = productImage.mimetype.split('/')[0];
        if (fileType !== 'image') {
            return res.status(400).json({ message: 'Uploaded file is not an image.' });
        }

        // Generate a unique filename
        const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(productImage.name)}`;

        // Upload the image to Cloudinary
        cloudinary.uploader.upload(productImage.tempFilePath, { public_id: uniqueFilename }, async (err, result) => {
            if (err) {
                console.error('Error while uploading product image to Cloudinary:', err);
                return res.status(500).json({ message: 'Error while uploading product image.' });
            }

            try {
                // Create new item with the Cloudinary URL for the image
                const newItem = new Item({
                    name,
                    description,
                    price,
                    quantity,
                    category,
                    seller: new mongoose.Types.ObjectId(seller),
                    productImage: result.secure_url
                });

                await newItem.save();
                res.status(201).json({ message: 'Item added successfully', item: newItem });
            } catch (error) {
                console.error('Error saving item to the database:', error);
                res.status(500).json({ message: 'Something went wrong while saving the item.' });
            }
        });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};






// Add quantity to an item
exports.addQuantity = async (req, res) => {
    try {
        const { seller, itemId, quantity } = req.body;

        // Find the item by seller and item ID
        const item = await Item.findOne({ _id: itemId, seller });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update quantity
        item.quantity += quantity;
        await item.save();

        res.status(200).json({ message: 'Quantity added successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Remove an item
exports.removeItem = async (req, res) => {
    try {
        const { seller, itemId } = req.body;

        // Find and remove the item by seller and item ID
        const item = await Item.findOneAndDelete({ _id: itemId, seller });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Decrease quantity of an item
exports.decreaseQuantity = async (req, res) => {
    try {
        const { seller, itemId, quantity } = req.body;

        // Find the item by seller and item ID
        const item = await Item.findOne({ _id: itemId, seller });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if sufficient quantity is available
        if (item.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity' });
        }

        // Update quantity
        item.quantity -= quantity;
        await item.save();

        res.status(200).json({ message: 'Quantity decreased successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update item information
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find and update the item by ID
        const item = await Item.findByIdAndUpdate(id, updates, { new: true });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Retrieve all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Retrieve some items based on query
exports.getSomeItems = async (req, res) => {
    try {
        const query = req.query; // Define your query parameters
        const items = await Item.find(query);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

//search
exports.searchItems = async (req, res) => {
    try {
      const query = req.query;
      const searchTerm = query.search;
  
      // Escape the search term to prevent potential regular expression injection vulnerabilities
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
  
      // Build the regular expression for case-insensitive search
      const regex = new RegExp(escapedTerm, 'i'); // 'i' flag for case-insensitive matching
  
      // Search for items matching the term across name, description, and category
      const items = await Item.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          { category: { $regex: regex } },
        ],
      });
  
      res.status(200).json(items);
    } catch (error) {
      console.error('Error searching items:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  
  

// Retrieve an item by ID
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Add an item to a user's cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        // Find the item
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }

        // Check if item is already in cart
        const existingItem = cart.items.find(cartItem => cartItem.item.equals(itemId));
        if (existingItem) {
            // Check if adding the quantity exceeds available quantity
            if (existingItem.quantity + quantity > item.quantity) {
                return res.status(400).json({ message: 'Exceeds available quantity' });
            }
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Check if adding the quantity exceeds available quantity
            if (quantity > item.quantity) {
                return res.status(400).json({ message: 'Exceeds available quantity' });
            }
            // Add new item
            cart.items.push({ item: itemId, quantity, seller: item.seller });
        }

        // Update total amount
        cart.totalAmount += item.price * quantity;
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};


// Remove an item from a user's cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(cartItem => cartItem.item.equals(itemId));
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update total amount
        cart.totalAmount -= cart.items[itemIndex].quantity * (await Item.findById(itemId)).price;

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

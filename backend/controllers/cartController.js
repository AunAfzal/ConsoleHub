
const Cart = require('../models/cart');
const Order = require('../models/order');
const Item = require('../models/item');
const User = require('../models/userr');

// Buy all items in the cart and create orders for each seller
exports.buyCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.item');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Group items by seller and create orders
        const ordersBySeller = cart.items.reduce((orders, cartItem) => {
            const { seller } = cartItem.item;
            if (!orders[seller]) {
                orders[seller] = {
                    user: userId,
                    items: [],
                    totalAmount: 0,
                    soldAt: null,
                    orderStatus: 'Pending',
                    seller: seller,
                };
            }
            orders[seller].items.push({
                item: cartItem.item._id,
                quantity: cartItem.quantity,
            });
            orders[seller].totalAmount += cartItem.quantity * cartItem.item.price;
            return orders;
        }, {});

        // Save each order and update item quantities
        const orderPromises = Object.values(ordersBySeller).map(async (orderData) => {
            // Reduce quantity of items
            for (const orderedItem of orderData.items) {
                const item = await Item.findById(orderedItem.item);
                item.quantity -= orderedItem.quantity;
            
                if (item.quantity <= 0) {
                    await item.remove(); // This will delete the item if the quantity is 0 or less
                } else {
                    await item.save(); // Save the item if quantity is greater than 0
                }
            }

            // Save order
            return new Order(orderData).save();
        });

        const orders = await Promise.all(orderPromises);

        // Clear the cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({ message: 'Orders created successfully', orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the cart for the specified user
        const cart = await Cart.findOne({ user: userId }).populate('items.item');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

//get cart items
exports.getCartItems = async (req, res) => {
    try {
      const { cartId } = req.params; // Assuming cart ID is in request parameters
  
      // Find the cart with the specified ID
      const cart = await Cart.findById(cartId).populate('items.item');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Extract item IDs from the cart's items array
      const itemIds = cart.items.map(cartItem => cartItem.item._id);
  
      // If no items found in the cart, return an empty array
      if (!itemIds.length) {
        return res.status(200).json([]); // Return an empty array with status 200 (OK)
      }
  
      // Fetch all item documents based on the extracted IDs
      const items = await Item.find({ _id: { $in: itemIds } });
  
      // Combine item documents with their corresponding quantities from the cart
      const cartItems = cart.items.map(cartItem => {
        const item = items.find(item => item._id.equals(cartItem.item._id));
        // Select specific item properties (excluding potentially sensitive data)
        const selectedItemProps = {
          _id: item._id, // Include ID if needed
          name: item.name,
          // Add other desired properties (e.g., description, price)
        };
        return { ...selectedItemProps, quantity: cartItem.quantity }; // Spread selected properties and add quantity
      });
  
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
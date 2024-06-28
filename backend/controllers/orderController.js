const Order = require('../models/order');
const User = require('../models/userr');

// Confirm an order and update seller's profit
exports.confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Find the order
        const order = await Order.findById(orderId).populate('seller');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status to "Confirmed"
        order.orderStatus = 'Confirmed';
        order.soldAt=new Date();
        await order.save();

        // Update seller's profit
        const seller = await User.findById(order.seller._id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.profit += order.totalAmount;
        await seller.save();

        res.status(200).json({ message: 'Order confirmed successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Automatically mark an order as shipped after 10 minutes
exports.shipOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Schedule the status update to "Shipped" after 10 minutes
        setTimeout(async () => {
            try {
                // Double-check the order status
                const orderToUpdate = await Order.findById(orderId);
                if (orderToUpdate && orderToUpdate.orderStatus === 'Confirmed') {
                    orderToUpdate.orderStatus = 'Shipped';
                    await orderToUpdate.save();
                    console.log(`Order ${orderId} marked as shipped`);
                }
            } catch (error) {
                console.error('Error updating order status to shipped:', error);
            }
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        res.status(200).json({ message: 'Order will be marked as shipped in 10 minutes', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getAllOrdersBySellerId = async (req, res) => {
    try {
        const { sellerId } = req.query;

        // Find all orders for the specified seller
        const orders = await Order.find({ seller: sellerId })
        .populate('items.item') // Populate items.item with product details
        .populate({
            path: 'user',
            select: 'name', // Select only the 'name' attribute from the user
        });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this seller' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
 
// Get shipped orders by seller ID
exports.getShippedOrdersBySellerId = async (req, res) => {
    try {
        const { sellerId } = req.query;

        // Find all shipped orders for the specified seller
        const orders = await Order.find({ seller: sellerId, orderStatus: { $in: ['Shipped', 'Confirmed'] }}).populate('items.item');
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No shipped orders found for this seller' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
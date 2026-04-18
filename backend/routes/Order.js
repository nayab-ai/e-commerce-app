const express = require('express');
const router = express.Router();
const Order = require('./models/Order');

// Place Order Route
router.post('/order', async (req, res) => {
    try {
        const { userId, items, total } = req.body;
        
        if (!userId) {
            return res.status(400).send('User not logged in!');
        }
        
        if (!items || items.length === 0) {
            return res.status(400).send('Cart is empty!');
        }
        
        const order = new Order({
            userId,
            items,
            total,
            status: 'completed'
        });
        
        await order.save();
        res.send('Order placed successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error placing order');
    }
});

// Get User Orders Route
router.get('/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching orders');
    }
});

module.exports = router;
const Order = require('../../../models/order');
const order = require('../../../models/order');
function orderController() {
  return {
     async index(req, res) {
      try {
        const orders = await Order.find({ status: { $ne: 'completed' } })
          .sort({ createdAt: -1 })
          .populate('customerId', '-password')
          .exec();

        if (req.xhr) {
          return res.json(orders);
        } else {
          return res.render('admin/orders');
        }
      } catch (err) {
        // Handle any errors that occurred during the query
        console.error(err);
        return res.status(500).json({ error: 'An error occurred.' });
      }
    }
  };
}

module.exports = orderController;

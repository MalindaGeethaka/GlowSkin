// Quick test script to verify order data structure
const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Order');

async function testOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glowskin');
    
    console.log('Connected to MongoDB');
    
    // Get a sample order without population
    const sampleOrder = await Order.findOne();
    
    if (sampleOrder) {
      console.log('Sample order structure:');
      console.log('Fields available:', Object.keys(sampleOrder.toObject()));
      console.log('totalAmount:', sampleOrder.totalAmount);
      console.log('totalPrice:', sampleOrder.totalPrice);
      
      // Test transformation like in controller
      const transformed = {
        ...sampleOrder.toObject(),
        totalPrice: sampleOrder.totalAmount
      };
      
      console.log('Transformed order fields:', Object.keys(transformed));
      console.log('Transformed totalPrice:', transformed.totalPrice);
      console.log('Transformed totalAmount:', transformed.totalAmount);
      
      // Check if values are numbers or undefined
      console.log('Type check - totalAmount is:', typeof sampleOrder.totalAmount);
      console.log('Type check - totalPrice is:', typeof sampleOrder.totalPrice);
    } else {
      console.log('No orders found in database');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testOrders();

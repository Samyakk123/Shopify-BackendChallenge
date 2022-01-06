const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * Schema for Inventory
 *
 * @property {String}       _id             Inventory id
 * @property {String}       name            Name of inventory
 * @property {Number}       price           Price of each inventory
 * @property {String}       description     Inventory description
 * @property {Quantity}     quantity        number of same inventory items
 * @property {String}       brand           Inventory brand
 * @property {[String]}     tags            Inventory Tags
 */

const inventorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name must not be empty!',
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be less then 0!'],
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 120,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be below 1!'],
  },
  brand: {
    type: String,
    required: 'Brand type must be provided!',
  },
  tags: {
    type: [String],
  },
});

module.exports = model('Inventory', inventorySchema);

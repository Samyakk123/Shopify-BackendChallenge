const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * Schema for Inventory
 *
 * @property {String}       _id             item id
 * @property {String}       name            Name of item
 * @property {Number}       price           Price of each item
 * @property {String}       description     item description
 * @property {Number}       quantity        number of items in storage
 * @property {String}       brand           item brand
 * @property {[String]}     tags            item Tags
 * 
 * The _id is the primary key for this collection
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
    min: [1, 'item quantity must be greater than 0! '],
  },
  brand: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
});

module.exports = model('Inventory', inventorySchema);

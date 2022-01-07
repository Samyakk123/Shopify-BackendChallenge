const inventorySchema = require('../models/inventory.model');

const router = require('express').Router();


/**
 * GET all items located in the inventory storage
 * 
 * @return items - list of all items currently in the database
 */
router.get('/', (req, res) => {
    inventorySchema.find().then((items) => {
      res.status(200).json(items ?? []);
    })
});

/**
 * GET all items located in the database matching a specific query filter (filtering for tags)
 * utilizes $all to ensure that ALL tags provided in the query filter must be present to be shown
 * @param tags contains a list of all the tags to look out for
 * 
 * @return result - list of all items matching query filters for tags 
 */
router.get('/filter/:tags', (req, res) => {
  const temp = req.params.tags.split("&")
  inventorySchema.find({
    tags: {
      $all: temp
    }
  }).then(result => {
    res.status(200).json(result ?? [])
  }).catch(err => {
    res.status(400).json(err)
  })
});


/**
 * Posts a new inventory item to the database
 * @param name Specifies the name of the new inventory item
 * @param price Contains the price of the new inventory item (Validation by Mongoose ensuring a value greater then 0)
 * @param description Short description about the item in question (Max character limit set to prevent user abuse)
 * @param quantity Contains the quantity of the new inventory item (Validation by Mongoose ensuring a value greater then 0)
 * @param brand Mentions the brand provided for the item
 * @param tags Any tags attached so that users can filter the inventory by these items
 * 
 * @return newItem - The newly created item
 */
router.post('/', (req, res) => {
  const { name, price, description, quantity, brand, tags } = req.body;
  const newItem = new inventorySchema({
    name, price, description, quantity, brand, tags,
  });
  newItem
    .save()
    .then(() => res.status(200).json(newItem))
    .catch((err) => res.status(400).json(err));
});

/**
 * Updates an existing inventory item with new values
 * @param id Specifies the id as stored on MongoDb for the item to modify
 * @param name Updates property by property to check for modification
 * @param price Updates property by property to check for modification
 * @param description Updates property by property to check for modification
 * @param quantity Updates property by property to check for modification
 * @param brandUpdates property by property to check for modification
 * @param tags Updates property by property to check for modification
 * 
 * @return newInventory - The new updated inventory item
 */
router.put('/:id', (req, res) => {
  inventorySchema.findById(req.params.id).then((newInventory) => {
    for (const element in req.body) {
      newInventory[element] = req.body[element];
    }
    newInventory
      .save()
      .then(() => res.status(200).json(newInventory))
      .catch((err) => res.status(400).json(err));
  });
});


/**
 * Deletes an item based on it's given id as stored on MongoDb
 * 
 * @return "deleted" confirming to the user item is deleted
 */
router.delete('/:id', (req, res) => {
  inventorySchema.findByIdAndRemove(req.params.id, function (err) {
    if (!err) {
      res.status(200).json('deleted');
    } else {
      return res.status(400).send();
    }
  })
});



module.exports = router;

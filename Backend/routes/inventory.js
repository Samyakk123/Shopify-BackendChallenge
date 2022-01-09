const inventorySchema = require("../models/inventory.model");

const router = require("express").Router();

/**
 * GET all items located in the inventory storage
 *
 * @return {[Object]} items - list of all items currently in the database
 */

/**
 * @swagger
 * /api/inventory:
 *  get:
 *    description: Get all Inventory data
 *    summary: Get all inventory data
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Request
 */
router.get("/", (req, res) => {
  inventorySchema.find().then((items) => {
    res.status(200).json(items ?? []);
  });
});

/**
 * GET all items located in the database matching a specific query filter (filtering for tags)
 * utilizes $all to ensure that ALL tags provided in the query filter must be present to be shown
 * @param {String} tags contains a list of all the tags to look out for
 *
 * @return {[Object]} result - list of all items matching query filters for tags
 */
// router.get('/filter/:tags', (req, res) => {
//   const temp = req.params.tags.split("&")
//   inventorySchema.find({
//     tags: {
//       $all: temp
//     }
//   }).then(result => {
//     res.status(200).json(result ?? [])
//   }).catch(err => {
//     res.status(400).json(err)
//   })
// });
router.get("/filter/:filter", (req, res) => {
  const filter = JSON.parse(req.params.filter);
  let query = {
    $and: [],
  };

  const properties = {
    name: {
      check: (name) => !!name,
      subquery: (name) => ({ $regex: name, $options: "i" }),
    },
    price: {
      check: (price) => +price > 0,
      subquery: (price) => ({ $gt: price }),
    },
    description: {
      check: (description) => !!description,
      subquery: (description) => ({ $regex: description, $options: "i" }),
    },
    quantity: {
      check: (quantity) => +quantity > 0,
      subquery: (quantity) => ({ $gt: quantity }),
    },
    brand: {
      check: (brand) => !!brand,
      subquery: (brand) => ({ $regex: brand, $options: "i" }),
    },
    tags: {
      check: (tags) => !!tags,
      subquery: (tags) => ({ $all: tags.split("&") }),
    },
  };

  Object.entries(properties).forEach(([key, { check, subquery }]) => {
    if (filter[key] && check(filter[key])) {
      query.$and.push({ [key]: subquery(filter[key]) });
    }
  });

  inventorySchema
    .find(!query.$and.length ? undefined : query)
    .then((result) => {
      res.status(200).json(result ?? []);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

/**
 * Posts a new inventory item to the database
 * @param {Object} inventory - The inventory JSON object
 *
 * @return {Object} newItem - The newly created item
 */
router.post("/", (req, res) => {
  const { name, price, description, quantity, brand, tags } = req.body;
  const newItem = new inventorySchema({
    name,
    price,
    description,
    quantity,
    brand,
    tags,
  });
  newItem
    .save()
    .then(() => res.status(200).json(newItem))
    .catch((err) => res.status(400).json(err));
});

/**
 * Updates an existing inventory item with new values
 * @param {Object} inventory The new inventory Object (with updated values)
 *
 * @return {Object} newInventory - The new updated inventory item
 */
router.put("/:id", (req, res) => {
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
 * @return {String} "deleted" confirming to the user item is deleted
 */
router.delete("/:id", (req, res) => {
  inventorySchema.findByIdAndRemove(req.params.id, function (err) {
    if (!err) {
      res.status(200).json("deleted");
    } else {
      return res.status(400).send();
    }
  });
});

module.exports = router;

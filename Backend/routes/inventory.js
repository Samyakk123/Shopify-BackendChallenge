const inventorySchema = require("../models/inventory.model");

const router = require("express").Router();

/**
 *
 * GET all items located in the inventory storage
 *
 * @return {[Object]} items - list of all items currently in the database
 *
 * @swagger
 * /api/inventory:
 *  get:
 *    description: Get all Inventory data
 *    summary: Get all inventory data
 *    tags: [Inventory]
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
 *
 *
 * @swagger
 * /api/inventory/filter/{filter}:
 *  get:
 *    tags: ['Inventory']
 *    description: Given a **JSON formatted** String `filter` will provide all inventory items matching the properties provided
 *    summary: Something
 *    produces:
 *      "application.json"
 *    parameters:
 *    - in: "path"
 *      name: "filter"
 *      required: false
 *      default: {"name":"Something","price":0,"description":"","quantity":0,"brand":"","tags":"clothing"}
 *      type: string
 *      description: ""
 *      schema:
 *        $ref: "#/definitions/Inventory"
 *    responses:
 *      '200':
 *        description: Items were successfully filtered and fetched
 *      '400':
 *        description: Invalid formatted request
 *
 */

router.get("/filter/:filter", (req, res) => {
  const filter = JSON.parse(req.params.filter);

  filter["comparison1"] = "$" + filter["comparison1"];
  filter["comparison2"] = "$" + filter["comparison2"];

  let query = {
    $and: [],
  };

  const properties = {
    name: {
      check: (name) => !!name,
      subquery: (name) => ({ $regex: name, $options: "i" }),
    },
    price: {
      check: (_) => true,
      subquery: (price) => ({ [filter["comparison1"]]: price }),
    },
    description: {
      check: (description) => !!description,
      subquery: (description) => ({ $regex: description, $options: "i" }),
    },
    quantity: {
      check: (_) => true,
      subquery: (quantity) => ({ [filter["comparison2"]]: quantity }),
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
      res.status(400).json(err);
    });
});

/**
 * Posts a new inventory item to the database
 * @param {Object} inventory - The inventory JSON object
 *
 * @return {Object} newItem - The newly created item
 *
 *
 * @swagger
 * /api/inventory:
 *  post:
 *    tags: ["Inventory"]
 *    description: Given `name`, `price`, `description`, `quantity`, `brand`, and `tags` (optional) will post the new item onto the inventory management.
 *    summary: Post a new inventory item
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application.json"
 *    parameters:
 *    - in: "body"
 *      name: "Request Body"
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Inventory"
 *    responses:
 *      '200':
 *        description: Sucessfully added new inventory item
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/definitions/Inventory"
 *      '400':
 *        description: Request body missing fields or invalid values
 *
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
 *
 *
 * @swagger
 * /api/inventory/{id}:
 *  put:
 *    tags: ['Inventory']
 *    description: Updates the JSON value for the item
 *    summary: Something
 *    produces:
 *      "application.json"
 *    parameters:
 *    - in: "path"
 *      name: "id"
 *      description: "(unique identifier) of the inventory item"
 *      required: true
 *    - in: "body"
 *      name: "Request Body"
 *      description: "JSON object with updated values to modify"
 *      required: true
 *      schema:
 *        $ref: "#/definitions/Inventory"
 *    responses:
 *      '200':
 *        description: Item was sucessfully updated with new values
 *      '400':
 *        description: Invalid formatted request
 *
 */
router.put("/:id", (req, res) => {
  inventorySchema
    .findById(req.params.id)
    .then((newInventory) => {
      for (const element in req.body) {
        newInventory[element] = req.body[element];
      }
      newInventory
        .save()
        .then(() => res.status(200).json(newInventory))
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

/**
 * Deletes an item based on it's given id as stored on MongoDb
 *
 * @return {String} "deleted" confirming to the user item is deleted
 *
 *
 * @swagger
 * /api/inventory/{id}:
 *  delete:
 *    tags: ['Inventory']
 *    description: Something
 *    summary: Something
 *    produces:
 *      "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "id"
 *      description: "**ID** (unique identifier) of the inventory item"
 *      required: true
 *    responses:
 *      '200':
 *        description: Sucessfully deleted inventory item with `{id}`
 *      '400':
 *        description: Missing id or not found
 *      '404':
 *        description: Invalid request URL
 *
 */
router.delete("/:id", (req, res) => {
  inventorySchema.findByIdAndRemove(req.params.id, function (err) {
    if (!err) {
      res.status(200).json("deleted");
    } else {
      res.status(400).send();
    }
  });
});

module.exports = router;

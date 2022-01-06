const inventorySchema = require('../models/inventory.model');

const router = require('express').Router();

router.get('/', (req, res) => {
    inventorySchema.find().then((items) => {
      res.status(200).json(items ?? []);
    })
});

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

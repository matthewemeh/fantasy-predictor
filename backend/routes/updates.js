const router = require('express').Router();
const Update = require('../models/update.model');

// READ
router.route('/').get((req, res) =>
  Update.find()
    .then(updates => res.json(updates))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// CREATE
router.route('/add').post((req, res) => {
  const {
    appLink,
    messages,
    currentGW,
    btcAddress,
    ethAddress,
    trxAddress,
    xrpAddress,
    dogeAddress,
    currentVersion,
  } = req.body;
  const newUpdates = new Update({
    appLink,
    messages,
    currentGW,
    btcAddress,
    ethAddress,
    trxAddress,
    xrpAddress,
    dogeAddress,
    currentVersion,
  });

  newUpdates
    .save()
    .then(() => res.json(`Updates added successfully!`))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// READ_BY_ID
router.route('/:id').get((req, res) =>
  Update.findById(req.params.id)
    .then(update => res.json(update))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// DELETE
router.route('/:id').delete((req, res) =>
  Update.findByIdAndDelete(req.params.id)
    .then(() => res.json('Update removed.'))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// UPDATE
router.route('/update/:id').post((req, res) =>
  Update.findById(req.params.id)
    .then(update => {
      update.appLink = req.body.appLink;
      update.messages = req.body.messages;
      update.currentGW = req.body.currentGW;
      update.btcAddress = req.body.btcAddress;
      update.ethAddress = req.body.ethAddress;
      update.trxAddress = req.body.trxAddress;
      update.xrpAddress = req.body.xrpAddress;
      update.dogeAddress = req.body.dogeAddress;
      update.currentVersion = req.body.currentVersion;

      update
        .save()
        .then(() => res.json('Updated successfully'))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
);

module.exports = router;

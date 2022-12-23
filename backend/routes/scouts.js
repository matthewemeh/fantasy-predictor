const router = require('express').Router();
const Scout = require('../models/scout.model');

// READ
router.route('/').get((req, res) =>
  Scout.find()
    .then(scout => res.json(scout))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// CREATE
router.route('/add').post((req, res) => {
  const { playerKeys, formation, captainIndex, gameweek } = req.body;
  const newScout = new Scout({ playerKeys, formation, captainIndex, gameweek });

  newScout
    .save()
    .then(() => res.json('Scout selection added!'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// READ_BY_ID
router.route('/:id').get((req, res) =>
  Scout.findById(req.params.id)
    .then(scout => res.json(scout))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// DELETE
router.route('/:id').delete((req, res) =>
  Scout.findByIdAndDelete(req.params.id)
    .then(() => res.json('Scout Selection removed.'))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// UPDATE
router.route('/update/:id').post((req, res) =>
  Scout.findById(req.params.id)
    .then(scout => {
      scout.gameweek = req.body.gameweek;
      scout.formation = req.body.formation;
      scout.playerKeys = req.body.playerKeys;
      scout.captainIndex = req.body.captainIndex;

      scout
        .save()
        .then(() => res.json('Scout Selection updated'))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
);

module.exports = router;

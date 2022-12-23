const router = require('express').Router();
const Player = require('../models/player.model');

// READ
router.route('/').get((req, res) =>
  Player.find()
    .then(players => res.json(players))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// CREATE
router.route('/add').post((req, res) => {
  const { available, points, team, index, position, playerName, key, chanceOfStarting } = req.body;
  const newPlayer = new Player({
    available,
    points,
    team,
    index,
    position,
    playerName,
    key,
    chanceOfStarting,
  });

  newPlayer
    .save()
    .then(() => res.json(`${playerName} added successfully!`))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// READ_BY_ID
router.route('/:id').get((req, res) =>
  Player.findById(req.params.id)
    .then(player => res.json(player))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// DELETE
router.route('/:id').delete((req, res) =>
  Player.findByIdAndDelete(req.params.id)
    .then(() => res.json('Player removed.'))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// UPDATE
router.route('/update/:id').post((req, res) =>
  Player.findById(req.params.id)
    .then(player => {
      player.team = req.body.team;
      player.index = req.body.index;
      player.points = req.body.points;
      player.position = req.body.position;
      player.available = req.body.available;
      player.playerName = req.body.playerName;
      player.chanceOfStarting = req.body.chanceOfStarting;

      player
        .save()
        .then(() => res.json(`${player.key}'s details updated`))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
);

module.exports = router;

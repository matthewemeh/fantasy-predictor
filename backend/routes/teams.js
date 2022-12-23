const router = require('express').Router();
const Team = require('../models/team.model');

// READ
router.route('/').get((req, res) =>
  Team.find()
    .then(teams => res.json(teams))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// CREATE
router.route('/add').post((req, res) => {
  const { relegated, teamName, index, playerKit, goalieKit, nextOpponent, abbreviation } = req.body;
  const newTeam = new Team({
    relegated,
    teamName,
    index,
    playerKit,
    goalieKit,
    nextOpponent,
    abbreviation,
  });

  newTeam
    .save()
    .then(() => res.json(`${teamName} added successfully!`))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// READ_BY_ID
router.route('/:id').get((req, res) =>
  Team.findById(req.params.id)
    .then(team => res.json(team))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// DELETE
router.route('/:id').delete((req, res) =>
  Team.findByIdAndDelete(req.params.id)
    .then(() => res.json('Team removed.'))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// UPDATE
router.route('/update/:id').post((req, res) =>
  Team.findById(req.params.id)
    .then(team => {
      team.index = req.body.index;
      team.teamName = req.body.teamName;
      team.relegated = req.body.relegated;
      team.playerKit = req.body.playerKit;
      team.goalieKit = req.body.goalieKit;
      team.nextOpponent = req.body.nextOpponent;
      team.abbreviation = req.body.abbreviation;

      team
        .save()
        .then(() => res.json(`${team.teamName}'s details updated`))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
);

module.exports = router;

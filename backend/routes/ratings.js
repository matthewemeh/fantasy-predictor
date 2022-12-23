const router = require('express').Router();
const Rating = require('../models/rating.model');

// READ
router.route('/').get((req, res) =>
  Rating.find()
    .then(ratings => res.json(ratings))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// CREATE
router.route('/add').post((req, res) => {
  const {
    redCard,
    ownGoal,
    yellowCard,
    minBonusPoint,
    maxBonusPoint,
    appearancePoint,
    savedPenaltyPoint,
    savesPerPoint,
    assistPoint,
    cleanSheetPoint,
    goalPoint,
  } = req.body;
  const newRating = new Rating({
    redCard,
    ownGoal,
    yellowCard,
    minBonusPoint,
    maxBonusPoint,
    appearancePoint,
    savedPenaltyPoint,
    savesPerPoint,
    assistPoint,
    cleanSheetPoint,
    goalPoint,
  });

  newRating
    .save()
    .then(() => res.json('Rating added successfully!'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// READ_BY_ID
router.route('/:id').get((req, res) =>
  Rating.findById(req.params.id)
    .then(rating => res.json(rating))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// DELETE
router.route('/:id').delete((req, res) =>
  Rating.findByIdAndDelete(req.params.id)
    .then(() => res.json('Rating removed.'))
    .catch(err => res.status(400).json(`Error: ${err}`))
);

// UPDATE
router.route('/update/:id').post((req, res) =>
  Rating.findById(req.params.id)
    .then(rating => {
      rating.redCard = req.body.redCard;
      rating.ownGoal = req.body.ownGoal;
      rating.goalPoint = req.body.goalPoint;
      rating.yellowCard = req.body.yellowCard;
      rating.assistPoint = req.body.assistPoint;
      rating.savesPerPoint = req.body.savesPerPoint;
      rating.minBonusPoint = req.body.minBonusPoint;
      rating.maxBonusPoint = req.body.maxBonusPoint;
      rating.cleanSheetPoint = req.body.cleanSheetPoint;
      rating.appearancePoint = req.body.appearancePoint;
      rating.savedPenaltyPoint = req.body.savedPenaltyPoint;

      rating
        .save()
        .then(() => res.json('Ratings updated'))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`))
);

module.exports = router;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    redCard: { type: Number, default: -2 },
    ownGoal: { type: Number, default: -2 },
    yellowCard: { type: Number, default: -1 },
    minBonusPoint: { type: Number, default: 1 },
    maxBonusPoint: { type: Number, default: 3 },
    appearancePoint: { type: Number, default: 2 },
    savedPenaltyPoint: { type: Number, default: 5 },
    savesPerPoint: {
      forward: { type: Number, default: 0 },
      defender: { type: Number, default: 0 },
      midfielder: { type: Number, default: 0 },
      goalkeeper: { type: Number, default: 3 },
    },
    assistPoint: {
      forward: { type: Number, default: 3 },
      defender: { type: Number, default: 3 },
      midfielder: { type: Number, default: 3 },
      goalkeeper: { type: Number, default: 3 },
    },
    cleanSheetPoint: {
      forward: { type: Number, default: 0 },
      defender: { type: Number, default: 4 },
      midfielder: { type: Number, default: 1 },
      goalkeeper: { type: Number, default: 4 },
    },
    goalPoint: {
      forward: { type: Number, default: 4 },
      defender: { type: Number, default: 6 },
      midfielder: { type: Number, default: 5 },
      goalkeeper: { type: Number, default: 6 },
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model('rating', ratingSchema);

module.exports = Rating;

const mongoose = require('mongoose');

const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    relegated: { type: Boolean, required: true },
    index: { type: Number, required: true, min: 0, max: 3 },
    playerKit: { type: String, required: true, trim: true },
    goalieKit: { type: String, required: true, trim: true },
    nextOpponent: { type: String, required: true, trim: true },
    teamName: { type: String, trim: true, required: true, unique: true },
    abbreviation: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 3,
      unique: true,
      required: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model('team', teamSchema);

module.exports = Team;

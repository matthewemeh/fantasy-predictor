const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerSchema = new Schema(
  {
    available: { type: Boolean, default: true },
    points: { type: [Number], default: [0, 0, 0] },
    team: { type: String, required: true, trim: true },
    index: { type: Number, required: true, min: 0, max: 10 },
    chanceOfStarting: { type: Number, default: 100, min: 0, max: 100 },
    playerName: { type: String, required: true, minlength: 2, trim: true },
    position: { type: String, required: true, lowercase: true, trim: true },
    key: { type: String, required: true, minlength: 2, trim: true, unique: true },
  },
  { timestamps: true }
);

const Player = mongoose.model('player', playerSchema);

module.exports = Player;

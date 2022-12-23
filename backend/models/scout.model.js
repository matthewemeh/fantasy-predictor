const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoutSchema = new Schema(
  {
    playerKeys: [String],
    gameweek: { type: String, required: true, trim: true },
    formation: { type: String, required: true, trim: true },
    captainIndex: { type: Number, default: 10, min: 0, max: 10 },
  },
  { timestamps: true }
);

const Scout = mongoose.model('scout', scoutSchema);

module.exports = Scout;

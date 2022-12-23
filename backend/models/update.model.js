const mongoose = require('mongoose');

const { Schema } = mongoose;

function oneDayFromNow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return date;
}

const info = new Schema(
  {
    forVersions: [String],
    expires: { type: Boolean, default: true },
    expiryDate: { type: Date, default: oneDayFromNow },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const updateSchema = new Schema(
  {
    messages: [info],
    appLink: { type: String, trim: true, required: true },
    currentGW: { type: String, trim: true, required: true },
    btcAddress: { type: String, trim: true, required: true },
    ethAddress: { type: String, trim: true, required: true },
    trxAddress: { type: String, trim: true, required: true },
    xrpAddress: { type: String, trim: true, required: true },
    dogeAddress: { type: String, trim: true, required: true },
    currentVersion: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

const Update = mongoose.model('update', updateSchema);

module.exports = Update;

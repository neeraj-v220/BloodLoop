const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
phone: {
  type: String,
  required: true,
  unique: true
},
  city: {
    type: String,
    required: true
  },
  lastDonationDate: {
    type: Date
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Donor", donorSchema);
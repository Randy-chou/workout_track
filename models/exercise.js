const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: "Enter type of exercise"
  },
  name: {
    type: String,
    trim: true,
    required: "Enter name of exercise"
  },
  distance: {
    type: Number
  },
  duration: {
    type: Number
  },
  weight: {
    type: Number
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
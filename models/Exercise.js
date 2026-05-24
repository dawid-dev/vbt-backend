const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String, // 'push', 'pull', 'squat', 'hinge'
  filterParams: {
    cutoffFreq: { type: Number, default: 5 },   // Hz
    minPeakHeight: { type: Number, default: 0.3 },
    minPeakDistance: { type: Number, default: 0.5 } // seconds
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
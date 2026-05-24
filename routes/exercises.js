const router = require('express').Router();
const Exercise = require('../models/Exercise');
const auth = require('./middleware');

router.get('/', auth, async (_, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
});

router.post('/seed', async (_, res) => {
  // Seed default exercises — call once
  const defaults = [
    { name: 'Bench Press', category: 'push', filterParams: { cutoffFreq: 5, minPeakHeight: 0.3, minPeakDistance: 0.5 } },
    { name: 'Squat', category: 'squat', filterParams: { cutoffFreq: 4, minPeakHeight: 0.5, minPeakDistance: 0.8 } },
    { name: 'Deadlift', category: 'hinge', filterParams: { cutoffFreq: 4, minPeakHeight: 0.4, minPeakDistance: 0.8 } },
    { name: 'Overhead Press', category: 'push', filterParams: { cutoffFreq: 5, minPeakHeight: 0.3, minPeakDistance: 0.5 } },
    { name: 'Romanian Deadlift', category: 'hinge', filterParams: { cutoffFreq: 4, minPeakHeight: 0.3, minPeakDistance: 0.7 } },
    { name: 'Pull-up', category: 'pull', filterParams: { cutoffFreq: 5, minPeakHeight: 0.4, minPeakDistance: 0.6 } },
  ];
  await Exercise.deleteMany();
  const result = await Exercise.insertMany(defaults);
  res.json(result);
});

module.exports = router;
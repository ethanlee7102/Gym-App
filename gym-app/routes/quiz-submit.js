const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET;

router.post('/quiz/submit', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    try{
        const { id } = jwt.verify(token, SECRET);
        const { gender, weight, personalRecords } = req.body;
        const profilePicture = 'https://gymapp-post-images.s3.us-west-2.amazonaws.com/profile-pic/1753340263142-photo.jpg';
        const coeffs = {
            Male: {
            a: -307.75076,
            b: 24.0900756,
            c: -0.1918759221,
            d: 0.0007391293,
            e: -0.000001093,
            },
            Female: {
            a: -57.96288,
            b: 13.6175032,
            c: -0.1126655495,
            d: 0.0005158568,
            e: -0.0000010706,

            },
        };

        const { a, b, c, d, e, f } = coeffs[gender];

        const kgWeight = weight * 0.45359237

        const denominator =
            a +
            b * kgWeight +
            c * kgWeight ** 2 +
            d * kgWeight ** 3 +
            e * kgWeight ** 4;

        const coefficient = 500/denominator;
        const total = (personalRecords.bench + personalRecords.squat + personalRecords.deadlift) * 0.45359237;
        const dots = coefficient * total

        const DOTSrank = getDotsRank(dots);

        const updatedUser = await User.findByIdAndUpdate(id, {
            gender,
            weight,
            personalRecords,
            quizComplete: true,
            profilePicture,
            dots,
            DOTSrank,
            },
            { new: true }
        )
    

        if (!updatedUser) return res.status(404).send({ error: 'User not found' });

        res.json({ success: true, user: updatedUser });
    }
    catch(e){
        console.error('Quiz submit error:', e);
        res.status(500).send({ error: 'Failed to submit quiz' });
    }
  


});

function getDotsRank(dots) {
  if (dots < 200) return 'Iron';
  if (dots > 500) return 'GOAT';

  const thresholds = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Elite',
    'Freak',
  ];

  const index = Math.floor((dots - 200) / (300 / thresholds.length));
  return thresholds[index] || 'Unranked';
}

module.exports = router;
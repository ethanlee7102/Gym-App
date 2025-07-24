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

        const updatedUser = await User.findByIdAndUpdate(id, {
            gender,
            weight,
            personalRecords,
            quizComplete: true,}
            ,
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

module.exports = router;
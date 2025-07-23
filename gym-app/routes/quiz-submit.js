const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

router.post('/quiz/submit', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const { id } = jwt.verify(token, SECRET);
    const { gender, weight, pr } = req.body;

    
});
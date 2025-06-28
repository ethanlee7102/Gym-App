const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET;

// Send friend request
router.post('/friends/request', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const { username: targetUsername } = req.body;

    try {
        const { id } = jwt.verify(token, SECRET);
        const sender = await User.findById(id);
        const recipient = await User.findOne({ username: targetUsername });

        if (!recipient) return res.status(404).send({ error: 'User not found' });
        if (recipient._id.equals(sender._id)) return res.status(400).send({ error: 'Cannot friend yourself' });
        if (recipient.friendRequestsReceived.includes(sender._id) || recipient.friends.includes(sender._id)) {
            return res.status(400).send({ error: 'Request already sent or already friends' });
        }
        if (sender.friendRequestsReceived.includes(recipient._id)) {
            return res.status(400).send({ error: 'User has already sent you a request' });
        }

        sender.friendRequestsSent.push(recipient._id);
        recipient.friendRequestsReceived.push(sender._id);

        await sender.save();
        await recipient.save();
        res.send({ success: true });
    } catch (e) {
        res.status(403).send({ error: 'Invalid token' });
    }
});

// Accept friend request
router.post('/friends/accept', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const { username: requesterUsername } = req.body;

    try {
        const { id } = jwt.verify(token, SECRET);
        const recipient = await User.findById(id);
        const requester = await User.findOne({ username: requesterUsername });

        if (!recipient || !requester) return res.status(404).send({ error: 'User not found' });
        if (!recipient.friendRequestsReceived.includes(requester._id)) {
            return res.status(400).send({ error: 'No friend request to accept' });
        }

        recipient.friends.push(requester._id);
        requester.friends.push(recipient._id);

        recipient.friendRequestsReceived = recipient.friendRequestsReceived.filter(
            id => !id.equals(requester._id)
        );
        requester.friendRequestsSent = requester.friendRequestsSent.filter(
            id => !id.equals(recipient._id)
        );

        await recipient.save();
        await requester.save();

        res.send({ success: true });
    } catch (e) {
        res.status(403).send({ error: 'Invalid token' });
    }
});

// Get received requests
router.get('/friends/requests', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    try {
        const { id } = jwt.verify(token, SECRET);
        const user = await User.findById(id).populate('friendRequestsReceived', 'username');
        res.send({ requests: user.friendRequestsReceived });
    } catch (e) {
        res.status(403).send({ error: 'Invalid token' });
    }
});

// Get sent requests
router.get('/friends/sentRequests', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    try {
        const { id } = jwt.verify(token, SECRET);
        const user = await User.findById(id).populate('friendRequestsSent', 'username');
        res.send({ sentRequests: user.friendRequestsSent });
    } catch (e) {
        res.status(403).send({ error: 'Invalid token' });
    }
});


module.exports = router;
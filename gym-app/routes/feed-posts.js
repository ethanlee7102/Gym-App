const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const SECRET = process.env.JWT_SECRET;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});



router.post('/api/posts', async (req, res) => {
    try {
      const { caption, userId, imageUrl } = req.body;
      const newPost = new Post({ userId, caption, imageUrl });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Post creation failed.' });
    }
});

router.get('/feed', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        return res.status(401).send({ error: 'Unauthorized' });
    } 
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    try {
        const { id } = jwt.verify(token, SECRET);
        const user = await User.findById(id).populate('friends');

        const posts = await Post.find({ userId: { $in: user.friends } })
            .populate('userId', 'username') 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.send({ posts });
    } catch (e) {
        res.status(500).send({ error: 'Failed to load feed' });
    }
});

router.get('/api/upload-url', async (req, res) => {
    try {
        const filename = `${Date.now()}-photo.jpg`;
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename,
            ContentType: 'image/jpeg',
        };
        const command = new PutObjectCommand(s3Params);
    
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    
        res.send({ uploadUrl, imageUrl });
    } catch (e) {
        console.error('Failed to generate signed URL:', e);
        res.status(500).send({ error: 'Could not generate signed URL' });
    }
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();
const SECRET = process.env.JWT_SECRET;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


const User = require('../models/User');
const Post = require('../models/Post');
const friendRoutes = require('../routes/friends');
const postRoutes = require('../routes/feed-posts');
const quizRoutes = require('../routes/quiz-submit')

app.use('/', postRoutes);
app.use('/', friendRoutes);
app.use('/', quizRoutes);



const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});


app.post("/login", async(req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (user && await bcrypt.compare(password, user.passwordHash)){
        const token = jwt.sign({ id: user._id }, SECRET);
        res.send({ token });
    }
    else{
        res.status(401).send({ error: 'Invalid credentials' });
    }
});

app.post('/register', async(req, res) => {
    console.log("register post")
    try{
        const { username, password } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(409).send({ error: 'Username already exists' });
        
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, passwordHash });
        await user.save();
        res.send({ success: true });
    }catch(e){
        res.status(500).send({ error: 'Server error' });
    }
});

app.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    try{
        const { id } = jwt.verify(token, SECRET);
        const user = await User.findById(id).populate('friends', 'username profilePicture DOTSrank level streak');
        if (!user) {

            return res.status(404).send({ error: 'User not found' });
        }
        res.send({
            username: user.username,
            friends: user.friends,
            userId: user.id,
            level: user.level,
            exp: user.exp,
            streak: user.streak,
            title: user.title,
            quizComplete: user.quizComplete,
            gender: user.gender,
            weight: user.weight,
            personalRecords: user.personalRecords,
            profilePicture: user.profilePicture,
            lastCheckIn: user.lastCheckIn,
            DOTSrank: user.DOTSrank,
        });
    } catch(e){
        return res.status(403).send({ error: 'Invalid token' });
    }
});

app.post('/api/profile-picture', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    try {
        
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const { imageUrl } = req.body;
        // const user = await User.findByIdAndUpdate(id, { profilePicture: imageUrl }, { new: true });

        // res.send({ success: true, user });

        const user = await User.findById(id);
        if (!user) return res.status(404).send({ error: 'User not found' });


        if (user.profilePicture) {
            const oldKey = user.profilePicture.split('/').pop();
            try {
                const deleteRes = await s3Client.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `profile-pic/${oldKey}`,
                }));
                // console.log(`Deleted old image: ${oldKey}`);

                
            } catch (deleteErr) {
                console.warn('Failed to delete old image:', deleteErr.message);
            }
        }


        user.profilePicture = imageUrl;
        await user.save();

        res.send({ success: true, user });

    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Failed to update profile picture' });
    }
});

app.post('/checkin', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    try{
        const { id } = jwt.verify(token, SECRET);
        const user = await User.findById(id);
        const today = new Date().toDateString();

        if (user.lastCheckIn?.toDateString() === today) {
            return res.send({ success: false, message: "Already checked in today" });
        }

        user.lastCheckIn = new Date();
        

        const gainedExp = 10 + user.streak * 2;
        user.exp += gainedExp;

        while (user.exp >= user.level * 25) {
            user.exp -= user.level * 25;
            user.level += 1;
        }
        user.streak += 1;

        // if ((user.exp + (10 + user.streak * 2)) >= (user.level * 25)){
        //     user.exp -= (user.level * 25);
        //     user.level += 1;
        // }
        // else{
        //     user.exp += (10 + user.streak * 2);
        // }
        await user.save();

        //TODO: add the what workout according to day

        //TODO: prompt to choose to add a photo?
        const newPost = new Post({ userId: user._id, caption: `I worked out today!`, imageUrl: '' });
        await newPost.save();
        
        res.send({
            success: true,
            message: 'Checked in successfully',
            streak: user.streak,
            level: user.level,
            exp: user.exp,
            lastCheckIn: user.lastCheckIn
        });

    } catch(e){
        console.error(e);
    }
});

app.get('/leaderboard/streaks', async (req, res) => {
    try {
        const topUsers = await User.find({ streak: { $gt: 0 } })
            .sort({ streak: -1 })
            .limit(30)
            .select('username streak profilePicture');

        res.send(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch leaderboard' });
    }
});

app.get('/leaderboard/level', async (req, res) => {
    try {
        const topUsers = await User.find({ level: { $gt: 0 } })
            .sort({ level: -1 })
            .limit(30)
            .select('username level profilePicture');

        res.send(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch leaderboard' });
    }
});

//TODO: figure out elo before using this
app.get('/leaderboard/elo', async (req, res) => {
    try {
        const topUsers = await User.find({ streak: { $gt: 0 } })
            .sort({ streak: -1 })
            .limit(30)
            .select('username streak profilePicture');

        res.send(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch leaderboard' });
    }
});

app.get('/leaderboard/dots', async (req, res) => {
    try {
        const topUsers = await User.find({ dots: { $gt: 0 } })
            .sort({ dots: -1 })
            .limit(30)
            .select('username dots DOTSrank profilePicture');

        res.send(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch leaderboard' });
    }
});

app.use((req, res) => {
    res.status(404).send({ error: 'Not found', path: req.originalUrl });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
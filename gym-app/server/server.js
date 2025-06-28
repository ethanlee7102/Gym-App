const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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

app.use('/', postRoutes);
app.use('/', friendRoutes);



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
        const user = await User.findById(id).populate('friends', 'username');
        if (!user) {

            return res.status(404).send({ error: 'User not found' });
        }
        res.send({
            username: user.username,
            friends: user.friends,
            userId: user.id,
            level: user.level,
            streak: user.streak,
            title: user.title,
            quizComplete: user.quizComplete,
        });
    } catch(e){
        return res.status(403).send({ error: 'Invalid token' });
    }
});

// app.post('/friends/request', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).send({ error: 'Unauthorized' });

//     const { username: targetUsername } = req.body;

//     try{
//         const { id } = jwt.verify(token, SECRET);
//         const sender = await User.findById(id);
//         const recipient = await User.findOne({ username: targetUsername });

//         if (!recipient){
//             return res.status(404).send({ error: 'User not found' });
//         } 

//         if (recipient._id.equals(sender._id)){
//             return res.status(400).send({ error: 'Cannot friend yourself' });
//         } 

//         if (recipient.friendRequestsReceived.includes(sender._id) || recipient.friends.includes(sender._id)) {
//             return res.status(400).send({ error: 'Request already sent or already friends' });
//         }

//         if (sender.friendRequestsReceived.includes(recipient._id)) {
//             return res.status(400).send({ error: 'User has already sent you a request' });
//         }
        
//         sender.friendRequestsSent.push(recipient._id);
//         recipient.friendRequestsReceived.push(sender._id);

//         await sender.save();
//         await recipient.save();
//         res.send({ success: true });
//     }catch(e){
//         res.status(403).send({ error: 'Invalid token' });
//     }
// });

// app.post('/friends/accept', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).send({ error: 'Unauthorized' });

//     const { username: requesterUsername } = req.body;

//     try{
//         const { id } = jwt.verify(token, SECRET);
//         const recipient = await User.findById(id);
//         const requester = await User.findOne({ username: requesterUsername });

//         if (!recipient || !requester) return res.status(404).send({ error: 'User not found' });

//         if (!recipient.friendRequestsReceived.includes(requester._id)) {
//             return res.status(400).send({ error: 'No friend request to accept' });
//         }

//         recipient.friends.push(requester._id);
//         requester.friends.push(recipient._id);

//         recipient.friendRequestsReceived = recipient.friendRequestsReceived.filter(
//             id => !id.equals(requester._id)
//         );
//         requester.friendRequestsSent = requester.friendRequestsSent.filter(
//             id => !id.equals(recipient._id)
//         );

//         await recipient.save();
//         await requester.save();

//         res.send({ success: true });
//     }catch(e){
//         res.status(403).send({ error: 'Invalid token' });
//     }
// });

// app.get('/friends/requests', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token){
//         return res.status(401).send({ error: 'Unauthorized' });
//     } 

//     try{
//         const { id } = jwt.verify(token, SECRET);
//         const user = await User.findById(id).populate('friendRequestsReceived', 'username');
//         res.send({ requests: user.friendRequestsReceived });
//     }catch(e){
//         res.status(403).send({ error: 'Invalid token' });
//     }
// });

// app.get('/friends/sentRequests', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token){
//         return res.status(401).send({ error: 'Unauthorized' });
//     } 

//     try{
//         const { id } = jwt.verify(token, SECRET);
//         const user = await User.findById(id).populate('friendRequestsSent', 'username');
//         res.send({ sentRequests: user.friendRequestsSent });
//     }catch(e){
//         res.status(403).send({ error: 'Invalid token' });
//     }
// });



app.use((req, res) => {
    res.status(404).send({ error: 'Not found', path: req.originalUrl });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
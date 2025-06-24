const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
const SECRET = process.env.JWT_SECRET;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String
});

const User = mongoose.model('User', UserSchema);

app.post("/login", async(req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (user && await bcrypt.compare(password, user.passwordHash)){
        const token = jwt.sign({ username }, SECRET);
        res.send({ token });
    }
    else{
        res.status(401).send({ error: 'Invalid credentials' });
    }
})

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
})

app.use((req, res) => {
    res.status(404).send({ error: 'Not found', path: req.originalUrl });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
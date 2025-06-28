const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    title: { type: String, default: 'Rookie' },
    personalRecords: {
        squat: { type: Number, default: 0 },
        bench: { type: Number, default: 0 },
        deadlift: { type: Number, default: 0 },
    },
    gender: { type: String, enum: ['male', 'female', 'other'], default: null },
    weight: { type: Number, default: null },
    quizComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
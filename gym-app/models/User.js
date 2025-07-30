const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    level: { type: Number, default: 1 },
    exp: {type: Number, default: 0},
    streak: { type: Number, default: 0 },
    title: { type: String, default: 'Rookie' },
    personalRecords: {
        squat: {
            weight: { type: Number, default: 0 },
            verified: { type: Boolean, default: false },
            videoUrl: { type: String, default: '' }
        },
        bench: {
            weight: { type: Number, default: 0 },
            verified: { type: Boolean, default: false },
            videoUrl: { type: String, default: '' }
        },
        deadlift: {
            weight: { type: Number, default: 0 },
            verified: { type: Boolean, default: false },
            videoUrl: { type: String, default: '' }
        }
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: null },
    weight: { type: Number, default: null },
    quizComplete: { type: Boolean, default: false },
    profilePicture: { type: String, default: 'https://gymapp-post-images.s3.us-west-2.amazonaws.com/profile-pic/1753829552138-photo.jpg' },
    dots: { type: Number, default: 0 },
    DOTSrank: { type: String, enum: ['Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Freak', 'GOAT'], default: 'Unranked' },
    lastCheckIn: { type: Date, default: null },
});

UserSchema.index({ streak: -1 });
UserSchema.index({ level: -1 });
UserSchema.index({ dots: -1 });

module.exports = mongoose.model('User', UserSchema);
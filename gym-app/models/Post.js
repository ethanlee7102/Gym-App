const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

PostSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
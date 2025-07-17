import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    update: { type: String, required: true },
    time: { type: Date, default: Date.now },
    gameId: { type: String, required: false }, // Optional game ID for game-related activities
    actionType: { type: String, required: true }, // Type of action: 'create', 'vote', 'view', 'search', 'delete', 'update', etc.
    metadata: { type: Object, required: false }, // Additional data like search terms, user info, etc.
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity 
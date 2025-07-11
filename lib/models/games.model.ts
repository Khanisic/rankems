import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, },
    friends: [{ type: String, required: true }],
    categories: [{ type: String, required: true }],
    votingMode: { type: String, required: true },
    usersRanked: [{ type: String }],
    votesCount: { type: Number, default: 0 },
}, { timestamps: true });

const Games = mongoose.models.Games || mongoose.model('Games', gameSchema);

export default Games
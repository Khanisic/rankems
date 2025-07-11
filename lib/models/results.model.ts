import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Games", required: true },
    votesCount: { type: Number, default: 0 },
    results: [{
        category: {
            name: { type: String, required: true },
            results: [{
                friend: { type: String, required: true },
                points: { type: Number, required: true },
                increase: { type: Boolean, default: false },
                decrease: { type: Boolean, default: false }
            }]
        },
    }],
}, { timestamps: true });



const Results = mongoose.models.Results || mongoose.model('Results', resultSchema);

export default Results
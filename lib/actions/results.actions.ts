
import Games from "../models/games.model";
import Results from "../models/results.model";
import dbConnect from "../mongoose";

export async function fetchResults(id: string) {
    try {
        await dbConnect();

        const gameExists = await Games.findOne({ id: id });
        if (!gameExists) {
            console.log("Game not found for ID:", id);
            return { error: "Game not found" }; // Return an object indicating the game was not found
        }

        const results = await Results.findOne({ id: gameExists._id }).lean();
        if (!results) {
            console.log("Results not found for game ID:", gameExists._id);
            return { error: "Results not found for this game" }; // Return an object indicating no results were found
        }

        return results; // Return the found results
    } catch (error) {
        console.error("Error fetching results:", error);
        throw new Error(`Error fetching results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

"use server"
import Games from "../models/games.model";
import Results from "../models/results.model";
import dbConnect from "../mongoose";
import { generateCode } from "../util";

// Define the structure of a single ranking
interface Ranking {
  friend: string;
  points: number;
  increase?: boolean;
  decrease?: boolean;
}

// Define the structure for the rankings by category
interface Rankings {
  [category: string]: string[]; // This assumes rankings are provided as arrays of friend names by category
}

// Define the structure for the results to be stored in the database
interface ResultEntry {
  category: {
    name: string;
    results: Ranking[];
  };
}

// Define the structure for existing results from database
interface ExistingResult {
  category: {
    name: string;
    results: Ranking[];
  };
}


export async function createGame(title: string, friends: string[], categories: string[], votingMode: string) {
  try {
    dbConnect();
    const code = generateCode();
    console.log(title, friends, categories, votingMode)

    const gameCodeExists = await Games.findOne({
      id: code
    })

    console.log(gameCodeExists)

    if (gameCodeExists) return

    const newGame = await Games.create({
      id: code,
      title,
      votesCount: 0,
      friends,
      categories,
      votingMode,
    })
    console.log(newGame)
    return newGame.id

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(errorMessage);
  }
}



export async function fetchGame(id: string) {
  try {
    dbConnect();

    const gameExists = await Games.findOne({
      id: id
    })
    console.log(gameExists.id)

    if (!gameExists) {
      return null
    }

    // Serialize the MongoDB document to a plain object
    const serializedGame = {
      id: gameExists.id,
      title: gameExists.title,
      friends: gameExists.friends,
      categories: gameExists.categories,
      votingMode: gameExists.votingMode,
      usersRanked: gameExists.usersRanked || [],
      votesCount: gameExists.votesCount,
      createdAt: gameExists.createdAt?.toISOString(),
      updatedAt: gameExists.updatedAt?.toISOString(),
    }
    console.log(serializedGame)
    return serializedGame

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(errorMessage);
  }
}


export async function submitRankingsandResults(
  rankings: Rankings, 
  id: string, 
  identity?: string | null, 
  isEditing?: boolean, 
  previousRankings?: Rankings
) {
  try {
    await dbConnect();

    const categories = Object.keys(rankings);
    const numberOfNames = rankings[categories[0]].length;
    const results: ResultEntry[] = [];

    const game = await Games.findOne({
      id
    })

    // If identity is provided and this is NOT an edit, check if this person has already voted
    if (identity && !isEditing && game?.usersRanked.includes(identity)) {
      throw new Error("You have already voted in this game!");
    }

    const existingResults = await Results.findOne({
      id: game._id
    })

    if (existingResults) {
      // Fix existing documents that don't have increase/decrease fields
      let needsUpdate = false;
      existingResults.results.forEach((categoryResult: ExistingResult) => {
        categoryResult.category.results.forEach((result: Ranking) => {
          if (result.increase === undefined || result.decrease === undefined) {
            result.increase = false;
            result.decrease = false;
            needsUpdate = true;
          }
        });
      });

      if (needsUpdate) {
        console.log("DEBUG - Updating existing document with missing fields");
        await existingResults.save();
      }

      existingResults.results.forEach((category: ExistingResult) => {
        const categoryName = category.category.name;
        const newRankings = rankings[categoryName];

        // Get previous rankings sorted by points (highest first)
        const previousRankingsSorted = [...category.category.results].sort((a, b) => b.points - a.points);

        let updatedResults;

        if (isEditing && previousRankings && previousRankings[categoryName]) {
          // EDITING: First subtract previous rankings, then add new ones
          const oldRankings = previousRankings[categoryName];
          
          // Subtract previous rankings
          updatedResults = category.category.results.map((res: Ranking) => {
            const oldIndex = oldRankings.indexOf(res.friend);
            const oldPoints = oldIndex !== -1 ? numberOfNames - oldIndex : 0;
            return {
              friend: res.friend,
              points: res.points - oldPoints, // Subtract old points
              increase: false,
              decrease: false
            };
          });

          // Add new rankings
          updatedResults = updatedResults.map((res: Ranking) => {
            const newIndex = newRankings.indexOf(res.friend);
            const newPoints = newIndex !== -1 ? numberOfNames - newIndex : 0;
            return {
              friend: res.friend,
              points: res.points + newPoints, // Add new points
              increase: false,
              decrease: false
            };
          });
        } else {
          // NEW VOTE: Just add the new rankings
          updatedResults = category.category.results.map((res: Ranking) => ({
            friend: res.friend,
            points: res.points + numberOfNames - newRankings.indexOf(res.friend),
            increase: false,
            decrease: false
          }));
        }

        // Sort by new points to get new rankings
        const newRankingsSorted = [...updatedResults].sort((a, b) => b.points - a.points);

        // Create maps for quick lookup of previous and new positions
        const previousPositions = new Map(previousRankingsSorted.map((item, index) => [item.friend, index]));
        const newPositions = new Map(newRankingsSorted.map((item, index) => [item.friend, index]));

        console.log("DEBUG - Category:", categoryName);
        console.log("DEBUG - Is editing:", isEditing);
        console.log("DEBUG - Previous positions:", Array.from(previousPositions.entries()));
        console.log("DEBUG - New positions:", Array.from(newPositions.entries()));

        // Calculate increase/decrease flags
        const rankedResults: Ranking[] = newRankingsSorted.map((item) => {
          const prevPosition = previousPositions.get(item.friend);
          const newPosition = newPositions.get(item.friend);

          let increase = false;
          let decrease = false;

          if (prevPosition !== undefined && newPosition !== undefined) {
            if (newPosition < prevPosition) {
              increase = true; // Moved up in ranking (lower index = higher rank)
            } else if (newPosition > prevPosition) {
              decrease = true; // Moved down in ranking (higher index = lower rank)
            }
          }

          console.log(`DEBUG - ${item.friend}: prev=${prevPosition}, new=${newPosition}, increase=${increase}, decrease=${decrease}`);

          return {
            friend: item.friend,
            points: item.points,
            increase,
            decrease
          };
        });

        console.log("DEBUG - Final rankedResults:", rankedResults);

        results.push({
          category: {
            name: categoryName,
            results: rankedResults
          }
        });
      })

      // Update the document directly and save
      existingResults.results = results;
      
      // Only increment vote count if this is NOT an edit
      if (!isEditing) {
        existingResults.votesCount = (existingResults.votesCount || 0) + 1;
      }
      
      existingResults.markModified('results');
      await existingResults.save();

      console.log("DEBUG - Saved results:", JSON.stringify(existingResults.results, null, 2));

      // Only add user to usersRanked and increment votesCount if this is NOT an edit
      if (!isEditing) {
        const userIdentifier = identity || `Anonymous_${Date.now()}`
        game.usersRanked.push(userIdentifier)
        game.votesCount = (game.votesCount || 0) + 1;
        await game.save()
      }

      return { msg: isEditing ? "Rankings updated" : "Rankings posted" }
    }

    // Handle case where no existing results (first vote)
    categories.forEach(category => {
      const rankedResults: Ranking[] = rankings[category].map((name, index) => ({
        friend: name,
        points: numberOfNames - index,
        increase: false,
        decrease: false
      }));

      results.push({
        category: {
          name: category,
          results: rankedResults
        }
      });

      console.log(rankedResults);
    });

    const createdResult = await Results.create({
      id: game._id,
      published: false,
      votesCount: 1,
      results,
    });

    // Add user to usersRanked and increment votesCount
    const userIdentifier = identity || `Anonymous_${Date.now()}`
    game.usersRanked.push(userIdentifier)
    game.votesCount = (game.votesCount || 0) + 1;
    await game.save()

    console.log("Result stored:", createdResult);

    return { msg: "Rankings posted" }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("Error submitting rankings and results:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function fetchResults(id: string) {
  try {
    dbConnect();

    const game = await Games.findOne({ id })
    console.log(game)
    if (!game) {
      return null
    }

    const results = await Results.findOne({ id: game._id })
    if (!results) {
      return null
    }

    // Properly serialize the results by sorting them and ensuring they're plain objects
    const serializedResults = {
      id: results.id.toString(),
      votesCount: game.votesCount,
      results: results.results.map((categoryResult: ResultEntry) => ({
        category: {
          name: categoryResult.category.name,
          results: categoryResult.category.results
            .map((ranking: Ranking) => ({
              friend: ranking.friend,
              points: ranking.points,
              increase: ranking.increase || false,
              decrease: ranking.decrease || false
            }))
            .sort((a: Ranking, b: Ranking) => b.points - a.points) // Sort by points descending
        }
      })),
      published: results.published,
      createdAt: results.createdAt?.toISOString(),
      updatedAt: results.updatedAt?.toISOString(),
    }

    return serializedResults

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(errorMessage);
  }
}

// Utility function to test ranking logic
export async function testRankingLogic(gameId: string) {
  try {
    await dbConnect();
    const game = await Games.findOne({ id: gameId });
    if (!game) return { error: "Game not found" };

    const results = await Results.findOne({ id: game._id });
    if (!results) return { error: "Results not found" };

    console.log("=== TESTING RANKING LOGIC ===");
    results.results.forEach((categoryResult: ExistingResult) => {
      console.log(`\nCategory: ${categoryResult.category.name}`);
      console.log("Current results:");
      const sorted = [...categoryResult.category.results].sort((a, b) => b.points - a.points);
      sorted.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.friend} (${result.points} points) - increase: ${result.increase}, decrease: ${result.decrease}`);
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Test error:", error);
    return { error: "Test failed" };
  }
}

export async function fetchTopPopularGames(limit: number = 5) {
  try {
    await dbConnect();
    
    // Get games with results and calculate ranking scores
    const gamesWithResults = await Games.aggregate([
      {
        $match: {
          votesCount: { $gt: 0 }, // Only games with at least 1 vote
          votingMode: "public" // Only public games
        }
      },
      {
        $lookup: {
          from: 'results',
          localField: '_id',
          foreignField: 'id',
          as: 'gameResults'
        }
      },
      {
        $match: {
          'gameResults.0': { $exists: true } // Only games that have results
        }
      },
      {
        $addFields: {
          // Calculate average ranking score across all categories and friends
          avgRankingScore: {
            $avg: {
              $map: {
                input: { $arrayElemAt: ['$gameResults.results', 0] },
                as: 'category',
                in: {
                  $avg: {
                    $map: {
                      input: '$$category.category.results',
                      as: 'result',
                      in: '$$result.points'
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $sort: { avgRankingScore: -1, votesCount: -1 } // Sort by ranking score, then vote count
      },
      {
        $limit: limit
      }
    ]);
    
    // If aggregation returns no results, fallback to simple vote count sorting
    if (gamesWithResults.length === 0) {
      const fallbackGames = await Games.find({
        votesCount: { $gt: 0 },
        votingMode: "public"
      })
      .sort({ votesCount: -1 })
      .limit(limit)
      .lean();
      
      return fallbackGames.map(game => ({
        id: game.id,
        title: game.title,
        friends: game.friends,
        categories: game.categories,
        votingMode: game.votingMode,
        usersRanked: game.usersRanked || [],
        votesCount: game.votesCount,
        createdAt: game.createdAt?.toISOString(),
        updatedAt: game.updatedAt?.toISOString(),
      }));
    }
    
    // Serialize the results with ranking-based ordering
    const serializedGames = gamesWithResults.map(game => ({
      id: game.id,
      title: game.title,
      friends: game.friends,
      categories: game.categories,
      votingMode: game.votingMode,
      usersRanked: game.usersRanked || [],
      votesCount: game.votesCount,
      createdAt: game.createdAt?.toISOString(),
      updatedAt: game.updatedAt?.toISOString(),
    }));
    
    return serializedGames;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(errorMessage);
  }
}

export async function searchPublicGames(searchTerm: string) {
  try {
    await dbConnect();
    
    // Search for games by title or category name that are public (have votes and results)
    const matchingGames = await Games.aggregate([
      {
        $match: {
          votesCount: { $gt: 0 }, // Only games with at least 1 vote
          $or: [
            { 
              title: { 
                $regex: searchTerm, 
                $options: 'i' // Case-insensitive search
              } 
            },
            { 
              categories: { 
                $elemMatch: { 
                  $regex: searchTerm, 
                  $options: 'i' // Case-insensitive search
                } 
              } 
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'results',
          localField: '_id',
          foreignField: 'id',
          as: 'gameResults'
        }
      },
      {
        $match: {
          'gameResults.0': { $exists: true } // Only games that have results
        }
      },
      {
        $sort: { votesCount: -1, updatedAt: -1 } // Sort by vote count, then by most recent
      },
      {
        $limit: 50 // Limit to 50 results to avoid overwhelming the UI
      }
    ]);
    
    // Serialize the results
    const serializedGames = matchingGames.map(game => ({
      id: game.id,
      title: game.title,
      friends: game.friends,
      categories: game.categories,
      votingMode: game.votingMode,
      usersRanked: game.usersRanked || [],
      votesCount: game.votesCount,
      createdAt: game.createdAt?.toISOString(),
      updatedAt: game.updatedAt?.toISOString(),
    }));
    
    return serializedGames;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(errorMessage);
  }
}

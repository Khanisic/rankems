import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchTopPopularGames, fetchResults } from '../../lib/actions/rank.actions'

interface PopularGame {
    id: string
    friends: string[]
    categories: string[]
    votingMode: string
    usersRanked: string[]
    votesCount: number
    createdAt: string
    updatedAt: string
}

interface RankingData {
    name: string
    rank: number
    increase: boolean
    decrease: boolean
}

interface GameResult {
    friend: string
    points: number
    increase: boolean
    decrease: boolean
}

interface CategoryResult {
    category: {
        name: string
        results: GameResult[]
    }
}

interface GameResults {
    id: string
    votesCount: number
    results: CategoryResult[]
    published: boolean
    createdAt: string
    updatedAt: string
}

interface LiveGameData {
    id: string
    title: string
    votes: number
    items: RankingData[]
}

function Live() {
    const router = useRouter()
    const colours = ["#5D4A59", "#37635E", "#374963", "#374963"]
    const [data, setData] = useState<LiveGameData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadLiveGames()
    }, [])

    const loadLiveGames = async () => {
        try {
            setLoading(true)
            const games = await fetchTopPopularGames(8)
            const processedGames = await Promise.all(
                games.map(async (game: PopularGame) => {
                    try {
                        const results: GameResults | null = await fetchResults(game.id)

                        let items: RankingData[] = []

                        if (results && results.results.length > 0) {
                            // Get the first category's results to order friends by points
                            const firstCategoryResults = results.results[0].category.results

                            // Sort friends by points (highest first) and create ranking data
                            items = firstCategoryResults
                                .sort((a: GameResult, b: GameResult) => b.points - a.points)
                                .map((result: GameResult, index: number) => ({
                                    name: result.friend,
                                    rank: index + 1,
                                    increase: result.increase || false,
                                    decrease: result.decrease || false,
                                }))
                        } else {
                            // Fallback: if no results, use original friends order
                            items = game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))
                        }

                        return {
                            id: game.id,
                            title: game.categories[0] || "Ranking Game", // Use first category as title
                            votes: game.votesCount,
                            items: items
                        }
                    } catch (error) {
                        console.error(`Failed to load results for game ${game.id}:`, error)
                        // Fallback data structure
                        return {
                            id: game.id,
                            title: game.categories[0] || "Ranking Game",
                            votes: game.votesCount,
                            items: game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))
                        }
                    }
                })
            )

            setData(processedGames)
        } catch (error) {
            console.error('Failed to load live games:', error)
            setError('Failed to load live games')
        } finally {
            setLoading(false)
        }
    }

    const handleGameClick = (gameId: string) => {
        router.push(`/game/${gameId}`)
    }

    if (loading) {
        return (
            <div className="bg-bg h-full px-20 flex items-center justify-center">
                <div className="text-white text-2xl font-mono">Loading live games...</div>
            </div>
        )
    }

    if (error || data.length === 0) {
        return (
            <div className="bg-bg h-full px-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-2xl font-mono mb-4">
                        {error || "No live games available"}
                    </div>
                    <p className="text-white text-lg font-mono">
                        Check back later for more games!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg h-full md:px-20 px-5">
            <p className="text-white font-mono text-4xl mt-10 mb-2 text-center">Current <span className="text-yellow">Live</span> Rankems</p>
            <p className="text-white font-sans text-2xl text-center mb-4">You can update your ranking anytime.</p>
            <div className="relative hidden md:block md:columns-2 lg:columns-3 xl:columns-4 gap-8">
                {data?.map((item, index) => (
                    <div
                        key={item.id}
                        className="mt-8  z-20 break-inside-avoid h-fit border border-border-box rounded-3xl p-4 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                        style={{ backgroundColor: colours[index % colours.length] }}
                        onClick={() => handleGameClick(item.id)}
                    >
                        <p className="text-white font-mono text-2xl px-4 text-center mb-2">{item.title}</p>
                        <div className="flex flex-col items-center gap-2 justify-center">
                            {item.items.map((rankItem, rankIndex) => (
                                <div key={rankIndex} className="w-full flex gap-3 items-center group bg-bg border-1 border-border-box rounded-xl px-5 py-2 justify-between">
                                    <div className="flex gap-3 items-center">
                                        <p className="font-base text-white text-sm">{rankItem.rank}.</p>
                                        {rankItem.increase &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        }

                                        {rankItem.decrease &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        }

                                        {!rankItem.increase && !rankItem.decrease &&
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                                                <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    </div>
                                    <p className="font-base text-white text-lg w-full leading-none text-center pr-12 md:pr-5">{rankItem.name}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-white font-mono text-sm text-center mt-2">{item.votes} votes</p>
                        <div className="text-center mt-2">
                            <p className="text-white font-mono text-xs opacity-75">Click to join ranking</p>
                        </div>

                        <button style={{ color: colours[index % colours.length] }} className="text-white relative mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors">
                            <p style={{ color: colours[index % colours.length] }} className="text-white font-mono md:text-xl text-lg group-hover:text-blue">Rank This!</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </button>


                    </div>
                ))}
            </div>

            {/* Mobile View */}
            <div className="relative flex flex-col md:hidden gap-8">
                {data?.map((item, index) => (
                    <div
                        key={item.id}
                        className="mt-8 z-20 break-inside-avoid h-fit border border-border-box rounded-3xl p-4 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                        style={{ backgroundColor: colours[index % colours.length] }}
                        onClick={() => handleGameClick(item.id)}
                    >
                        <p className="text-white font-mono text-2xl text-center mb-2">{item.title}</p>
                        <div className="flex flex-col items-center gap-2 justify-center">
                            {item.items.map((rankItem, rankIndex) => (
                                <div key={rankIndex} className="w-full flex gap-3 items-center group bg-bg border-1 border-border-box rounded-xl px-5 py-2 justify-between">
                                    <div className="flex gap-3 items-center">
                                        <p className="font-base text-white text-sm">{rankItem.rank}.</p>
                                        {rankItem.increase &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        }

                                        {rankItem.decrease &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        }

                                        {!rankItem.increase && !rankItem.decrease &&
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                                                <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    </div>
                                    <p className="font-base text-white text-lg w-full leading-none text-center pr-4">{rankItem.name}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-white font-mono text-sm text-center mt-2">{item.votes} votes</p>
                        <div className="text-center mt-2">
                            <p className="text-white font-mono text-xs opacity-75">Click to join ranking</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Live
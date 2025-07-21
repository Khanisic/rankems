"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchGame, fetchResults } from '../../../lib/actions/rank.actions'
import { getUserGames } from '../../../lib/util'

interface Game {
    id: string
    title: string
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

interface MyGameData {
    id: string
    title: string
    votes: number
    items: RankingData[]
    votedAt?: string
}

function Mine() {
    const router = useRouter()
    const colours = ["#5D4A59", "#37635E", "#374963", "#3C3763"]
    const [data, setData] = useState<MyGameData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadMyGames()
    }, [])

    const loadMyGames = async () => {
        try {
            setLoading(true)
            const gameIds = getUserGames()

            if (gameIds.length === 0) {
                setData([])
                setLoading(false)
                return
            }

            const processedGames: MyGameData[] = []

            await Promise.all(
                gameIds.map(async (gameId: string) => {
                    try {
                        const game: Game | null = await fetchGame(gameId)
                        if (!game) return

                        const results: GameResults | null = await fetchResults(gameId)

                        // Get user's vote timestamp from session storage
                        const userVoteKey = `game_vote_${gameId}`
                        const userVoteData = localStorage.getItem(userVoteKey)
                        let votedAt: string | undefined

                        if (userVoteData) {
                            try {
                                const parsed = JSON.parse(userVoteData)
                                votedAt = parsed.votedAt
                            } catch (e) {
                                console.error('Error parsing user vote data:', e)
                            }
                        }

                        if (results && results.results.length > 0) {
                            // Process each category separately
                            results.results.forEach((categoryResult: CategoryResult) => {
                                const items: RankingData[] = categoryResult.category.results
                                    .sort((a: GameResult, b: GameResult) => b.points - a.points)
                                    .map((result: GameResult, index: number) => ({
                                        name: result.friend,
                                        rank: index + 1,
                                        increase: result.increase || false,
                                        decrease: result.decrease || false,
                                    }))

                                processedGames.push({
                                    id: game.id,
                                    title: `${game.title} - ${categoryResult.category.name}`,
                                    votes: game.votesCount,
                                    items: items,
                                    votedAt: votedAt
                                })
                            })
                        } else {
                            // Fallback: if no results, create cards for each category with friends in original order
                            game.categories.forEach((category: string) => {
                                const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                    name: friend,
                                    rank: index + 1,
                                    increase: false,
                                    decrease: false,
                                }))

                                processedGames.push({
                                    id: game.id,
                                    title: `${game.title} - ${category}`,
                                    votes: game.votesCount,
                                    items: items,
                                    votedAt: votedAt
                                })
                            })
                        }
                    } catch (error) {
                        console.error(`Failed to load game ${gameId}:`, error)
                    }
                })
            )

            // Sort games by voted date (most recent first)
            const sortedGames = processedGames.sort((a, b) => {
                if (a.votedAt && b.votedAt) {
                    return new Date(b.votedAt).getTime() - new Date(a.votedAt).getTime()
                }
                return 0
            })

            setData(sortedGames)
        } catch (error) {
            console.error('Failed to load my games:', error)
            setError('Failed to load your games')
        } finally {
            setLoading(false)
        }
    }

    const handleGameClick = (gameId: string) => {
        router.push(`/game/${gameId}`)
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="bg-bg min-h-screen px-20 flex items-center justify-center">
                <div className="text-white text-2xl font-mono">Loading your rankems...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-bg min-h-screen px-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-2xl font-mono mb-4">{error}</div>
                    <button
                        onClick={loadMyGames}
                        className="text-white bg-blue px-4 py-2 rounded-full font-mono hover:bg-opacity-80"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-bg min-h-screen px-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-2xl font-mono mb-4">
                        No rankems found
                    </div>
                    <p className="text-white text-lg font-mono mb-6">
                        You haven&#39;t voted on any games yet!
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-white bg-blue px-6 py-2 rounded-full font-mono hover:bg-opacity-80"
                    >
                        Explore Live Games
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg min-h-screen md:px-20 px-5 pb-20">
            <head>
                <title>My Rankems</title>
                <meta name="description" content="My Rankems" />
                <meta name="keywords" content="My Rankems" />
                <meta name="author" content="Abdul Moid Khan" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2968967867450442"
                    crossOrigin="anonymous"></script>
            </head>
            <div className="flex w-full justify-center flex-col items-center">
                <div onClick={() => router.push("/")} className="bg-yellow my-2 flex items-center gap-4 border-b-4 border-white  hover:text-yellow  cursor-pointer duration-100 ease-in-out transition-all  hover:bg-transparent text-2xl text-black py-2 px-8 font-mono rounded-full mt-8">
                    <p>Home</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M5.25 6.31v9.44a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75h11.25a.75.75 0 0 1 0 1.5H6.31l13.72 13.72a.75.75 0 1 1-1.06 1.06L5.25 6.31Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <p className="text-white font-mono text-4xl pt-10 mb-2 text-center">My <span className="text-yellow">Rankems</span></p>
            <p className="text-white font-sans text-2xl text-center mb-10">Games you&#39;ve voted on or created</p>

            <div className="relative hidden md:block md:columns-2 lg:columns-3 xl:columns-4 gap-8">
                {data?.map((item, index) => (
                    <div
                        key={item.id + index}
                        className="mt-8 z-20 break-inside-avoid h-fit border border-border-box rounded-3xl p-4 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
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
                        {item.votedAt && (
                            <p className="text-white font-mono text-xs text-center mt-1 opacity-70">
                                Voted: {formatDate(item.votedAt)}
                            </p>
                        )}

                        <button
                            style={{ color: colours[index % colours.length] }}
                            className="text-white relative mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-blue hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors"
                        >
                            <p style={{ color: colours[index % colours.length] }} className="text-white font-mono md:text-xl text-lg group-hover:text-blue">View/Edit</p>
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
                        key={item.id + index}
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
                        <p className="text-white font-mono text-lg text-center mt-2">{item.votes} votes</p>
                        {item.votedAt && (
                            <p className="text-white font-mono text-sm text-center mt-1 opacity-70">
                                Voted: {formatDate(item.votedAt)}
                            </p>
                        )}
                        <button
                            style={{ color: colours[index % colours.length] }}
                            className="text-white relative mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-blue hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors"
                        >
                            <p style={{ color: colours[index % colours.length] }} className="text-white font-mono md:text-xl text-lg group-hover:text-blue">View/Edit</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Mine
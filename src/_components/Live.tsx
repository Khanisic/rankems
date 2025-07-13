import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchTopPopularGames, fetchResults, searchPublicGames } from '../../lib/actions/rank.actions'

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
    const colours = ["#5D4A59", "#37635E", "#374963", "#3C3763"]
    const [data, setData] = useState<LiveGameData[]>([])
    const [filteredData, setFilteredData] = useState<LiveGameData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")

    useEffect(() => {
        loadLiveGames()
    }, [])

    const loadLiveGames = async () => {
        try {
            setLoading(true)
            const games = await fetchTopPopularGames(8)
            const processedGames: LiveGameData[] = []

            await Promise.all(
                games.map(async (game: PopularGame) => {
                    try {
                        const results: GameResults | null = await fetchResults(game.id)

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
                                    title: categoryResult.category.name,
                                    votes: game.votesCount,
                                    items: items
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
                                    title: category,
                                    votes: game.votesCount,
                                    items: items
                                })
                            })
                        }
                    } catch (error) {
                        console.error(`Failed to load results for game ${game.id}:`, error)
                        // Fallback data structure - create cards for each category
                        game.categories.forEach((category: string) => {
                            const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))

                            processedGames.push({
                                id: game.id,
                                title: category,
                                votes: game.votesCount,
                                items: items
                            })
                        })
                    }
                })
            )

            setData(processedGames)
            setFilteredData(processedGames)
        } catch (error) {
            console.error('Failed to load live games:', error)
            setError('Failed to load live games')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setFilteredData(data)
            return
        }

        setSearchLoading(true)
        
        try {
            // Search through all public games in the database
            const searchResults = await searchPublicGames(searchTerm)
            const processedSearchResults: LiveGameData[] = []

            await Promise.all(
                searchResults.map(async (game: PopularGame) => {
                    try {
                        const results: GameResults | null = await fetchResults(game.id)

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

                                processedSearchResults.push({
                                    id: game.id,
                                    title: categoryResult.category.name,
                                    votes: game.votesCount,
                                    items: items
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

                                processedSearchResults.push({
                                    id: game.id,
                                    title: category,
                                    votes: game.votesCount,
                                    items: items
                                })
                            })
                        }
                    } catch (error) {
                        console.error(`Failed to load results for game ${game.id}:`, error)
                        // Fallback data structure - create cards for each category
                        game.categories.forEach((category: string) => {
                            const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))

                            processedSearchResults.push({
                                id: game.id,
                                title: category,
                                votes: game.votesCount,
                                items: items
                            })
                        })
                    }
                })
            )

            setFilteredData(processedSearchResults)
        } catch (error) {
            console.error('Search failed:', error)
            setFilteredData([])
        } finally {
            setSearchLoading(false)
        }
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        // If search term is cleared, show all games
        if (e.target.value.trim() === "") {
            setFilteredData(data)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
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

    const displayData = filteredData.length > 0 ? filteredData : (searchTerm.trim() !== "" ? [] : data)

    return (
        <div className="bg-bg h-full md:px-20 px-5">
            <p className="text-white font-mono text-4xl mt-10 mb-2 text-center">Current <span className="text-yellow">Live</span> Rankems</p>
            <p className="text-white font-sans text-2xl text-center mb-4">You can update your ranking anytime.</p>
            <div className='flex-col md:flex-row flex items-center justify-center w-full gap-4 mb-10'>
                <div className=" flex items-center justify-center w-fit gap-2 bg-bg border-b-2 border-white rounded-full px-4 py-2">
                    <input 
                        type="text" 
                        placeholder="Search for rankems" 
                        className="text-blue text-center font-mono text-2xl outline-none bg-transparent"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </div>
                <button 
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className='flex items-center justify-center w-fit bg-blue group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white px-5 py-1 rounded-full gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {searchLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <p className='text-white font-mono text-2xl group-hover:text-blue'>Searching...</p>
                        </>
                    ) : (
                        <p className='text-white font-mono text-2xl group-hover:text-blue'>Search</p>
                    )}
                </button>
            </div>
            <div className="relative hidden md:block md:columns-2 lg:columns-3 xl:columns-4 gap-8">
                {displayData?.length === 0 && searchTerm.trim() !== "" ? (
                    <div className="text-center w-full justify-center items-center mx-auto">
                        <div className="text-white text-2xl font-sans mb-4">
                            No games found for <span className='text-blue'>&quot;{searchTerm}&quot;</span>
                        </div>
                        <p className="text-white text-xl font-sans">
                            Try searching for a different category!
                        </p>
                    </div>
                ) : (
                    displayData?.map((item, index) => (
                    <div
                        key={item.id + index}
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

                        <button style={{ color: colours[index % colours.length] }} className="text-white relative mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors">
                            <p style={{ color: colours[index % colours.length] }} className="text-white font-mono md:text-xl text-lg group-hover:text-blue">Rank This!</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </button>


                    </div>
                    ))
                )}
            </div>

            {/* Mobile View */}
            <div className="relative flex flex-col md:hidden gap-8">
                {displayData?.length === 0 && searchTerm.trim() !== "" ? (
                    <div className="text-center">
                        <div className="text-white text-2xl font-mono mb-4">
                            No games found for &quot;{searchTerm}&quot;
                        </div>
                        <p className="text-white text-lg font-mono">
                            Try searching for a different category!
                        </p>
                    </div>
                ) : (
                    displayData?.map((item, index) => (
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
                        <button style={{ color: colours[index % colours.length] }} className="text-white relative mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors">
                            <p style={{ color: colours[index % colours.length] }} className="text-white font-mono md:text-xl text-lg group-hover:text-blue">Rank This!</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </button>
                    </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Live
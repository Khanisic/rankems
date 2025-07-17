import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchTopLiveGames, fetchResults, searchPublicGames } from '../../lib/actions/rank.actions'
import TrianglesLive from './TrianglesLive'


interface PopularGame {
    id: string
    title: string
    friends: string[]
    categories: string[]
    votingMode: string
    usersRanked: string[]
    votesCount: number
    createdAt: string
    updatedAt: string
    featured: boolean
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

interface GameCategory {
    name: string
    items: RankingData[]
}

interface LiveGameData {
    id: string
    title: string
    votes: number
    categories: GameCategory[]
    featured: boolean
}

function Live() {
    const router = useRouter()
    const colours = ["#5D4A59", "#37635E", "#374963", "#3C3763"]
    const coloursDark = ["#2E2234", "#21373D", "#1E243C", "#1C2238"]

    const [data, setData] = useState<LiveGameData[]>([])
    const [filteredData, setFilteredData] = useState<LiveGameData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [currentCategoryIndices, setCurrentCategoryIndices] = useState<{ [gameId: string]: number }>({})

    useEffect(() => {
        loadLiveGames()
    }, [])

    const loadLiveGames = async () => {
        try {
            setLoading(true)
            const games = await fetchTopLiveGames(8)
            const processedGames: LiveGameData[] = []

            await Promise.all(
                games.map(async (game: PopularGame) => {
                    try {
                        const results: GameResults | null = await fetchResults(game.id)
                        const categories: GameCategory[] = []

                        if (results && results.results.length > 0) {
                            // Process each category
                            results.results.forEach((categoryResult: CategoryResult) => {
                                const items: RankingData[] = categoryResult.category.results
                                    .sort((a: GameResult, b: GameResult) => b.points - a.points)
                                    .map((result: GameResult, index: number) => ({
                                        name: result.friend,
                                        rank: index + 1,
                                        increase: result.increase || false,
                                        decrease: result.decrease || false,
                                    }))

                                categories.push({
                                    name: categoryResult.category.name,
                                    items: items
                                })
                            })
                        } else {
                            // Fallback: if no results, create categories with friends in original order
                            game.categories.forEach((category: string) => {
                                const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                    name: friend,
                                    rank: index + 1,
                                    increase: false,
                                    decrease: false,
                                }))

                                categories.push({
                                    name: category,
                                    items: items
                                })
                            })
                        }

                        processedGames.push({
                            id: game.id,
                            title: game.title,
                            votes: game.votesCount,
                            categories: categories,
                            featured: game.featured
                        })
                    } catch (error) {
                        console.error(`Failed to load results for game ${game.id}:`, error)
                        // Fallback data structure
                        const categories: GameCategory[] = game.categories.map((category: string) => {
                            const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))

                            return {
                                name: category,
                                items: items
                            }
                        })

                        processedGames.push({
                            id: game.id,
                            title: game.title,
                            votes: game.votesCount,
                            categories: categories,
                            featured: game.featured
                        })
                    }
                })
            )

            setData(processedGames)
            setFilteredData(processedGames)

            // Initialize current category indices
            const initialIndices: { [gameId: string]: number } = {}
            processedGames.forEach(game => {
                initialIndices[game.id] = 0
            })
            setCurrentCategoryIndices(initialIndices)
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
                        const categories: GameCategory[] = []

                        if (results && results.results.length > 0) {
                            // Process each category
                            results.results.forEach((categoryResult: CategoryResult) => {
                                const items: RankingData[] = categoryResult.category.results
                                    .sort((a: GameResult, b: GameResult) => b.points - a.points)
                                    .map((result: GameResult, index: number) => ({
                                        name: result.friend,
                                        rank: index + 1,
                                        increase: result.increase || false,
                                        decrease: result.decrease || false,
                                    }))

                                categories.push({
                                    name: categoryResult.category.name,
                                    items: items
                                })
                            })
                        } else {
                            // Fallback: if no results, create categories with friends in original order
                            game.categories.forEach((category: string) => {
                                const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                    name: friend,
                                    rank: index + 1,
                                    increase: false,
                                    decrease: false,
                                }))

                                categories.push({
                                    name: category,
                                    items: items
                                })
                            })
                        }

                        processedSearchResults.push({
                            id: game.id,
                            title: game.title,
                            votes: game.votesCount,
                            categories: categories,
                            featured: game.featured
                        })
                    } catch (error) {
                        console.error(`Failed to load results for game ${game.id}:`, error)
                        // Fallback data structure
                        const categories: GameCategory[] = game.categories.map((category: string) => {
                            const items: RankingData[] = game.friends.map((friend: string, index: number) => ({
                                name: friend,
                                rank: index + 1,
                                increase: false,
                                decrease: false,
                            }))

                            return {
                                name: category,
                                items: items
                            }
                        })

                        processedSearchResults.push({
                            id: game.id,
                            title: game.title,
                            votes: game.votesCount,
                            categories: categories,
                            featured: game.featured
                        })
                    }
                })
            )

            setFilteredData(processedSearchResults)

            // Initialize current category indices for search results
            const initialIndices: { [gameId: string]: number } = {}
            processedSearchResults.forEach(game => {
                initialIndices[game.id] = 0
            })
            setCurrentCategoryIndices(prev => ({ ...prev, ...initialIndices }))
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

    const handlePrevCategory = (gameId: string) => {
        setCurrentCategoryIndices(prev => {
            const game = (filteredData.length > 0 ? filteredData : data).find(g => g.id === gameId)
            if (!game) return prev

            const currentIndex = prev[gameId] || 0
            const newIndex = currentIndex > 0 ? currentIndex - 1 : game.categories.length - 1

            return {
                ...prev,
                [gameId]: newIndex
            }
        })
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
            <div className="relative z-0 w-full flex items-center justify-center">
                <TrianglesLive />
                <p className="text-white font-mono text-3xl z-10 md:text-6xl mt-10 mb-2 text-center">Current <span className="text-yellow">Live</span> Rankems</p>
            </div>
            <p className="text-white font-lond text-2xl text-center mb-4">Below are the live results of your rankems.</p>
            <div className='flex-col md:flex-row flex items-center justify-center w-full gap-4 mb-5'>
                <div className=" flex items-center justify-center w-fit gap-2 bg-bg border-b-2 border-white rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder="Search for rankems"
                        className="text-white text-center font-mono text-2xl outline-none bg-transparent"
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
            {/* Desktop View */}
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
                    displayData?.map((item, mainIndex) => {
                        const currentCategoryIndex = currentCategoryIndices[item.id] || 0
                        const currentCategory = item.categories[currentCategoryIndex]
                        const hasMultipleCategories = item.categories.length > 1

                        return (
                            <div
                                key={item.id}
                                className="relative z-0">
                                <div className=" z-10 mt-10 p-4 break-inside-avoid h-fit border border-border-box rounded-3xl  hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-2xl " style={{ backgroundColor: colours[mainIndex % colours.length] }}>

                                    {item.featured && (
                                        <div className="absolute top-5 left-5 ">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 stroke-yellow fill-yellow">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                            </svg>

                                        </div>
                                    )}
                                    {item.title && (
                                        <p className="text-white font-mono text-2xl px-4 text-center z-10">{item.title}</p>
                                    )}
                                    <p className="text-white font-lond text-base text-center">{item.votes} votes</p>
                                    <div className="flex flex-col items-center gap-2 justify-center">
                                        {currentCategory.items.map((rankItem, rankIndex) => (
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


                                    {/* Category header with navigation */}
                                    <div className="flex items-center justify-center my-2 gap-2 px-2">

                                        <p className="text-white font-lond text-2xl text-center">
                                            {currentCategory.name}
                                        </p>
                                    </div>
                                    {hasMultipleCategories &&
                                        <div className='w-full flex justify-center gap-2'>
                                            {item.categories.map((currentCategory, index) => {
                                                return (
                                                    <div key={index} className={`w-3 h-3 rounded-full bg-white ${index === currentCategoryIndex ? 'border-b-2 border-white' : ''}`} style={{ backgroundColor: coloursDark[mainIndex % colours.length] }}>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                    <div className="flex items-center justify-between gap-2 my-2">
                                        {hasMultipleCategories && (
                                            <div className='flex items-center justify-center absolute left-0 bottom-0  rounded-bl-3xl rounded-tr-3xl  w-15 h-12 bg-bg group'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handlePrevCategory(item.id)
                                                    }}
                                                    className={`text-white cursor-pointer flex items-center gap-0 relative outline-none group-hover:scale-120 group-hover:-translate-x-1 transition-all ease-in-out duration-300`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute group-hover:left-2 transition-all ease-in-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {hasMultipleCategories && (
                                            <div className='flex items-center justify-center absolute right-0 bottom-0 rounded-br-3xl rounded-tl-3xl  w-15 h-12 bg-bg group'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handlePrevCategory(item.id)
                                                    }}
                                                    className={`text-white cursor-pointer flex items-center gap-0 relative outline-none group-hover:scale-120 group-hover:-translate-x-1 transition-all ease-in-out duration-300`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute group-hover:left-2 transition-all ease-in-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleGameClick(item.id)
                                    }}
                                    style={{ color: colours[mainIndex % colours.length] }}
                                    className="text-white absolute -bottom-5 left-[50%] -translate-x-1/2 mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-yellow  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors"
                                >
                                    <p className="text-white font-mono md:text-xl text-lg group-hover:text-yellow">Rank This!</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-yellow transition-all ease-in-out duration-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                    </svg>
                                </button>
                                {hasMultipleCategories &&
                                    <div style={{ backgroundColor: coloursDark[mainIndex % colours.length] }} className="absolute top-[15px] left-3 -z-10  w-full h-[95%]  rounded-3xl">
                                    </div>
                                }

                                {hasMultipleCategories &&
                                    <div style={{ backgroundColor: coloursDark[mainIndex % colours.length] }} className="absolute top-[15px] right-3 -z-10  w-full h-[95%]  rounded-3xl">
                                    </div>
                                }
                            </div>
                        )
                    })
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
                    displayData?.map((item, mainIndex) => {
                        const currentCategoryIndex = currentCategoryIndices[item.id] || 0
                        const currentCategory = item.categories[currentCategoryIndex]
                        const hasMultipleCategories = item.categories.length > 1

                        return (
                            <div
                                key={item.id}
                                className="relative z-0">

                                <div className=" z-10 mt-10 p-4 break-inside-avoid h-fit border border-border-box rounded-3xl  hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-2xl " style={{ backgroundColor: colours[mainIndex % colours.length] }}>
                                    {item.title && (
                                        <p className="text-white font-mono text-2xl px-4 text-center z-10">{item.title}</p>
                                    )}
                                    <p className="text-white font-lond text-base text-center">{item.votes} votes</p>
                                    <div className="flex flex-col items-center gap-2 justify-center">
                                        {currentCategory.items.map((rankItem, rankIndex) => (
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


                                    {/* Category header with navigation */}
                                    <div className="flex items-center justify-center my-2 gap-2 px-2">

                                        <p className="text-white font-lond text-2xl text-center">
                                            {currentCategory.name}
                                        </p>
                                    </div>
                                    {hasMultipleCategories &&
                                        <div className='w-full flex justify-center gap-2'>
                                            {item.categories.map((currentCategory, index) => {
                                                return (
                                                    <div key={index} className={`w-3 h-3 rounded-full bg-white ${index === currentCategoryIndex ? 'border-b-2 border-white' : ''}`} style={{ backgroundColor: coloursDark[mainIndex % colours.length] }}>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                    <div className="flex items-center justify-between gap-2 my-2">
                                        {hasMultipleCategories && (
                                            <div className='flex items-center justify-center absolute left-0 bottom-0  rounded-bl-3xl rounded-tr-3xl  w-15 h-12 bg-bg group'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handlePrevCategory(item.id)
                                                    }}
                                                    className={`text-white cursor-pointer flex items-center gap-0 relative outline-none group-hover:scale-120 group-hover:-translate-x-1 transition-all ease-in-out duration-300`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute group-hover:left-2 transition-all ease-in-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {hasMultipleCategories && (
                                            <div className='flex items-center justify-center absolute right-0 bottom-0 rounded-br-3xl rounded-tl-3xl  w-15 h-12 bg-bg group'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handlePrevCategory(item.id)
                                                    }}
                                                    className={`text-white cursor-pointer flex items-center gap-0 relative outline-none group-hover:scale-120 group-hover:-translate-x-1 transition-all ease-in-out duration-300`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 absolute group-hover:left-2 transition-all ease-in-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleGameClick(item.id)
                                    }}
                                    style={{ color: colours[mainIndex % colours.length] }}
                                    className="text-white absolute -bottom-5 left-[50%] -translate-x-1/2 mx-auto mt-4 bg-bg group hover:bg-bg border-b-2 hover:border-yellow  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-fit flex gap-2 items-center cursor-pointer transition-colors"
                                >
                                    <p className="text-white font-mono md:text-xl text-lg group-hover:text-yellow">Rank This!</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-yellow transition-all ease-in-out duration-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                    </svg>
                                </button>
                                {hasMultipleCategories &&
                                    <div style={{ backgroundColor: coloursDark[mainIndex % colours.length] }} className="absolute top-15 left-3 -z-10  w-full h-[85%]  rounded-3xl">
                                    </div>
                                }

                                {hasMultipleCategories &&
                                    <div style={{ backgroundColor: coloursDark[mainIndex % colours.length] }} className="absolute top-15 right-3 -z-10  w-full h-[85%]  rounded-3xl">
                                    </div>
                                }
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Live
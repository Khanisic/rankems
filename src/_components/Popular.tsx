import React, { useState, useEffect } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { fetchTopPopularGames, submitRankingsandResults, fetchResults } from '../../lib/actions/rank.actions'
import { hasUserVoted, getUserVote, saveUserVote } from '../../lib/util'
import toast from 'react-hot-toast'


interface PopularGame {
    id: string
    title: string
    friends: string[]
    categories: string[]
    votingMode: string
    usersRanked: string[]
    votesCount: number
    featured: boolean
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

function Popular() {
    const [popularGames, setPopularGames] = useState<PopularGame[]>([])
    const [currentGameIndex, setCurrentGameIndex] = useState(0)
    const [currentGame, setCurrentGame] = useState<PopularGame | null>(null)
    const [data, setData] = useState<RankingData[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [allGamesCompleted, setAllGamesCompleted] = useState(false)
    const [currentCategory, setCurrentCategory] = useState(0)
    const [showCursorAnimation, setShowCursorAnimation] = useState(true)
    const [showSubmitCursor, setShowSubmitCursor] = useState(false)
    const [isEditingVote, setIsEditingVote] = useState(false)
    const [userVoteData, setUserVoteData] = useState<{ [key: string]: string[] } | null>(null)

    // Load popular games on component mount
    useEffect(() => {
        loadPopularGames()
    }, [])

    // Update current game when index changes
    useEffect(() => {
        if (popularGames.length > 0 && currentGameIndex < popularGames.length) {
            const game = popularGames[currentGameIndex]
            setCurrentGame(game)
            loadGameResults(game)
        } else if (currentGameIndex >= 5) {
            setAllGamesCompleted(true)
        }
    }, [popularGames, currentGameIndex])

    // Load game results and order friends by their points
    const loadGameResults = async (game: PopularGame) => {
        try {
            // Check if user has already voted on this game
            const hasVoted = hasUserVoted(game.id)
            const previousVote = getUserVote(game.id)
            
            setIsEditingVote(hasVoted)
            setUserVoteData(previousVote?.rankings || null)
            
            // If user has voted, load their previous rankings for the current category
            if (hasVoted && previousVote?.rankings) {
                const currentCategoryName = game.categories[currentCategory]
                const previousRankings = previousVote.rankings[currentCategoryName]
                
                if (previousRankings && previousRankings.length > 0) {
                    const rankingData = previousRankings.map((friend: string, index: number) => ({
                        name: friend,
                        rank: index + 1,
                        increase: false,
                        decrease: false,
                    }))
                    setData(rankingData)
                    return
                }
            }
            
            // Load results from database if no previous vote or no rankings for current category
            const results: GameResults | null = await fetchResults(game.id)
            
            if (results && results.results.length > 0) {
                // Get the first category's results to order friends by points
                const firstCategoryResults = results.results[0].category.results
                
                // Sort friends by points (highest first) and create ranking data
                const sortedFriends = firstCategoryResults
                    .sort((a: GameResult, b: GameResult) => b.points - a.points)
                    .map((result: GameResult, index: number) => ({
                        name: result.friend,
                        rank: index + 1,
                        increase: result.increase || false,
                        decrease: result.decrease || false,
                    }))
                
                setData(sortedFriends)
            } else {
                // Fallback: if no results, use original friends order
                const friends = game.friends.map((friend: string, index: number) => ({
                    name: friend,
                    rank: index + 1,
                    increase: false,
                    decrease: false,
                }))
                setData(friends)
            }
            
            setCurrentCategory(0) // Reset to first category
        } catch (error) {
            console.error('Failed to load game results:', error)
            // Fallback: use original friends order
            const friends = game.friends.map((friend: string, index: number) => ({
                name: friend,
                rank: index + 1,
                increase: false,
                decrease: false,
            }))
            setData(friends)
            setCurrentCategory(0)
        }
    }

    const loadPopularGames = async () => {
        try {
            setLoading(true)
            const games = await fetchTopPopularGames(5)
            setPopularGames(games)
            if (games.length === 0) {
                setAllGamesCompleted(true)
            }
        } catch (error) {
            console.error('Failed to load popular games:', error)
            setAllGamesCompleted(true)
        } finally {
            setLoading(false)
        }
    }

    const handleReorder = (newOrder: RankingData[]) => {
        setData(newOrder.map((item, index) => ({
            ...item,
            rank: index + 1
        })))
        setShowCursorAnimation(false)
        setShowSubmitCursor(true)
    }

    const handleSubmit = async () => {
        if (!currentGame || submitting) return

        try {
            setSubmitting(true)
            
            // Create rankings object for submission
            const rankings: { [key: string]: string[] } = {}
            
            // If user is editing, merge with existing vote data
            if (isEditingVote && userVoteData) {
                Object.assign(rankings, userVoteData)
            }
            
            // Update current category ranking
            if (currentGame.categories[currentCategory]) {
                rankings[currentGame.categories[currentCategory]] = data.map(item => item.name)
            }

            // Get previous rankings if editing
            const previousRankings = isEditingVote ? userVoteData : undefined;

            // Save to session storage
            saveUserVote(currentGame.id, rankings)

            await submitRankingsandResults(
                rankings, 
                currentGame.id, 
                null, // identity not used in popular games
                isEditingVote,
                previousRankings || undefined
            )
            toast.success(isEditingVote ? "Rankings updated successfully" : "Rankings submitted successfully")
            
            // Move to next category or next game
            if (currentCategory < currentGame.categories.length - 1) {
                // More categories in current game
                const nextCategory = currentCategory + 1
                setCurrentCategory(nextCategory)
                
                // Load previous vote data for next category if available
                if (isEditingVote && userVoteData) {
                    const nextCategoryName = currentGame.categories[nextCategory]
                    const previousRankings = userVoteData[nextCategoryName]
                    
                    if (previousRankings && previousRankings.length > 0) {
                        const rankingData = previousRankings.map((friend: string, index: number) => ({
                            name: friend,
                            rank: index + 1,
                            increase: false,
                            decrease: false,
                        }))
                        setData(rankingData)
                    }
                }
                
                setShowSubmitCursor(false)
                setShowCursorAnimation(true)
            } else {
                // Move to next game
                setCurrentGameIndex(currentGameIndex + 1)
                setShowSubmitCursor(false)
                setShowCursorAnimation(true)
            }
            
        } catch (error) {
            console.error('Failed to submit ranking:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleNext = () => {
        // Skip current game/category
        if (!currentGame) return

        if (currentCategory < currentGame.categories.length - 1) {
            // Move to next category in current game
            const nextCategory = currentCategory + 1
            setCurrentCategory(nextCategory)
            
            // Load previous vote data for next category if available
            if (isEditingVote && userVoteData) {
                const nextCategoryName = currentGame.categories[nextCategory]
                const previousRankings = userVoteData[nextCategoryName]
                
                if (previousRankings && previousRankings.length > 0) {
                    const rankingData = previousRankings.map((friend: string, index: number) => ({
                        name: friend,
                        rank: index + 1,
                        increase: false,
                        decrease: false,
                    }))
                    setData(rankingData)
                }
            }
        } else {
            // Move to next game
            setCurrentGameIndex(currentGameIndex + 1)
        }
        setShowSubmitCursor(false)
        setShowCursorAnimation(true)
    }

    const AnimatedCursor = () => (
        <AnimatePresence>
            {showCursorAnimation && !allGamesCompleted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-[-15px] pointer-events-none z-50"
                >
                    <motion.div
                        animate={{
                            x: [150, 150, 150],
                            y: [250, 180, 250],
                            rotate: [0, 10, 0],
                            scale: [1, 1, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-white text-4xl drop-shadow-lg"
                    >
                        <Image src="/hand-grab.svg" alt="hand-grab" width={30} height={30} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    const SubmitCursor = () => (
        <AnimatePresence>
            {showSubmitCursor && !allGamesCompleted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none z-50"
                    style={{ bottom: '-20px', right: '0px' }}
                >
                    <motion.div
                        animate={{
                            x: [0, 10, 0],
                            y: [0, -5, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-white text-3xl drop-shadow-lg"
                    >
                        👆
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    if (loading) {
        return (
            <div className="flex relative flex-col items-center justify-center pt-10 md:w-[500px] w-[320px] mx-auto">
                <div className="text-white text-2xl font-mono">Loading popular games...</div>
            </div>
        )
    }

    if (allGamesCompleted || popularGames.length === 0) {
        return (
            <div className="flex relative flex-col items-center justify-center pt-10 md:w-[500px] w-[320px] mx-auto">
                <div className="text-center">
                    <h2 className="font-mono text-white text-4xl mb-6">🎉 All Done!</h2>
                    <p className="font-base text-white text-xl mb-4">
                        You&apos;ve ranked all top 5 popular games
                    </p>
                    <p className="font-base text-green text-lg">
                        Scroll down to see more games or create your own!
                    </p>
                </div>
            </div>
        )
    }

    if (!currentGame) {
        return (
            <div className="flex relative flex-col items-center justify-center pt-10 md:w-[500px] w-[320px] mx-auto">
                <div className="text-white text-2xl font-mono">No games available</div>
            </div>
        )
    }

    const currentCategoryName = currentGame.categories[currentCategory] || "Ranking"

    return (
        <div className="flex relative flex-col items-center justify-center mb-10 pt-10 md:w-[500px] w-[75%] mx-auto">
            <AnimatedCursor />
            <SubmitCursor />
            <div className="flex gap-3 items-center justify-between w-full">
                <div className="flex flex-col">
                    <p className="font-mono text-white md:text-2xl text-xl mb-1">{currentGame.title}</p>
                    <p className="font-mono text-white md:text-lg text-base">{currentCategoryName}</p>
                    <p className="font-base text-pink text-lg">
                        Game {currentGameIndex + 1} of {Math.min(popularGames.length, 5)}
                    </p>
                </div>
                <div className="flex gap-3 items-center cursor-pointer group" onClick={handleNext}>
                    <p className="font-base text-green md:text-2xl text-xl">Next</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 transition-all ease-in-out duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-col gap-3 items-center justify-center pt-5 w-full">
                <Reorder.Group axis="y" values={data} onReorder={handleReorder} className="w-full flex flex-col gap-3">
                    {data.map((item) => {
                        return (
                            <Reorder.Item
                                key={item.name}
                                value={item}
                                whileDrag={{ scale: 1.05, zIndex: 10 }}
                                className="flex gap-3 items-center cursor-grab active:cursor-grabbing group bg-box border-1 border-border-box rounded-full px-3 py-1 w-full justify-between"
                            >
                                <div className="flex gap-3 items-center">
                                    <p className="font-base text-white md:text-2xl text-lg">{item.rank}.</p>
                                    {item.increase &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }

                                    {item.decrease &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }

                                    {!item.increase && !item.decrease &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                                            <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                </div>
                                <p className="font-base text-white md:text-2xl text-lg w-full text-center pr-4 md:pr-12">{item.name}</p>
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>
            </div>

            <div className="flex gap-3 items-center justify-between pt-5 w-full">
                <div className="flex gap-3 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-purple">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    <p className="font-base text-white md:text-xl text-lg">{currentGame.votesCount}</p>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex gap-3 items-center bg-green border-b-4 hover:bg-bg cursor-pointer transition-all ease-in-out duration-300 border-white hover:border-green rounded-full px-5 py-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <p className="font-base text-bg group-hover:text-green font-mono md:text-2xl text-xl">
                        {submitting ? (isEditingVote ? 'Updating...' : 'Submitting...') : (isEditingVote ? 'Update' : 'Submit')}
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 group-hover:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Popular
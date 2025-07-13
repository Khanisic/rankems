"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchGame, submitRankingsandResults } from '../../../../lib/actions/rank.actions'
import { hasUserVoted, getUserVote, saveUserVote } from '../../../../lib/util'
import { Reorder, motion, useAnimation } from 'framer-motion'
import toast from 'react-hot-toast'

interface Game {
    id: string
    friends: string[]
    categories: string[]
    votingMode: string
    usersRanked: string[]
    createdAt: string
    votesCount: number
    updatedAt: string
}
const variants = {
    reset: { rotate: 0 },
    shake: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.7, repeat: 0 }    // one-time shake
    }
};

function GamePage() {
    const params = useParams()
    const router = useRouter()
    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Identity selection for restrictive mode
    const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null)
    const [showIdentityModal, setShowIdentityModal] = useState(false)
    const [identityError, setIdentityError] = useState("")

    // Ranking state
    const [names, setNames] = useState<string[]>([])
    const [category, setCategory] = useState(0)
    const [categories, setCategories] = useState<string[]>([])
    const [rankings, setRankings] = useState<{ [key: string]: string[] }>({})
    const [submitted, setSubmitted] = useState(false)
    const [isEditingVote, setIsEditingVote] = useState(false)
    const controls = useAnimation()

    useEffect(() => {
        // skip on mount if you like:
        if (categories.length && !loading) {
            controls
                .start("shake")
                .then(() => controls.start("reset"))
        }
    }, [category])

    useEffect(() => {
        const loadGame = async () => {
            try {
                if (params.id) {
                    const gameData = await fetchGame(params.id as string)
                    if (gameData) {
                        setGame(gameData)
                        setNames([...gameData.friends])
                        setCategories(gameData.categories)

                        // Check if user has already voted on this game
                        const hasVoted = hasUserVoted(params.id as string)
                        const previousVote = getUserVote(params.id as string)

                        setIsEditingVote(hasVoted)

                        // If user has voted, load their previous rankings and identity
                        if (hasVoted && previousVote?.rankings) {
                            setRankings(previousVote.rankings)

                            // Load rankings for the current category (first category)
                            const firstCategoryName = gameData.categories[0]
                            const firstCategoryRankings = previousVote.rankings[firstCategoryName]

                            if (firstCategoryRankings && firstCategoryRankings.length > 0) {
                                setNames(firstCategoryRankings)
                            }

                            // If restrictive mode and user has previously voted, set their identity
                            if (gameData.votingMode === 'restrictive' && previousVote.identity) {
                                setSelectedIdentity(previousVote.identity)
                            }
                        }

                        // Check if restrictive mode and show identity modal
                        if (gameData.votingMode === 'restrictive') {
                            // Only show modal if user hasn't voted before
                            if (!hasVoted) {
                                setShowIdentityModal(true)
                            }
                        }
                    } else {
                        setError("Game not found")
                    }
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load game"
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        loadGame()
    }, [params.id])

    const handleIdentitySelect = (identity: string) => {
        // If user has already voted, they should not be able to select any identity
        if (isEditingVote) {
            setIdentityError("You have already voted in this game! You cannot select a new identity.")
            return
        }

        // Check if this person has already voted
        if (game?.usersRanked.includes(identity)) {
            setIdentityError("This person has already voted in this game!")
            return
        }

        setSelectedIdentity(identity)
        setShowIdentityModal(false)
        setIdentityError("")
    }

    const nextStep = () => {
        // 1) Save current rankings
        const updatedRankings = {
            ...rankings,
            [categories[category]]: names
        }
        setRankings(updatedRankings)

        // 2) Advance category
        const nextCategoryIndex = Math.min(category + 1, categories.length - 1)
        setCategory(nextCategoryIndex)

        // 3) Load previous vote data for next category if available
        if (isEditingVote && updatedRankings[categories[nextCategoryIndex]]) {
            setNames(updatedRankings[categories[nextCategoryIndex]])
        } else {
            // Reshuffle names if no previous data
            setNames(game!.friends.sort(() => Math.random() - 0.5))
        }
        // <-- no controls.start here
    }

    const submitRankings = async () => {
        const updatedRankings = {
            ...rankings,
            [categories[category]]: names
        };
        setRankings(updatedRankings);
        console.log("Submitting Rankings: ", updatedRankings);

        try {
            // Get previous rankings if editing
            const previousVote = isEditingVote ? getUserVote(game!.id) : null;
            const previousRankings = previousVote?.rankings || undefined;

            // Save to session storage
            saveUserVote(game!.id, updatedRankings, selectedIdentity || undefined);

            const identity = game?.votingMode === 'restrictive' ? selectedIdentity : null
            const res = await submitRankingsandResults(
                updatedRankings,
                game!.id,
                identity,
                isEditingVote,
                previousRankings
            )
            console.log(res)
            setSubmitted(true)
            if (res && res.msg) {
                // You can add toast notification here if you have a toast library
                console.log(isEditingVote ? "Updated rankings" : "Submitted rankings")
                toast.success(isEditingVote ? "Rankings updated successfully!" : "Rankings submitted successfully!")
            }
            router.push(`/results/${game!.id}`)
        } catch (error) {
            console.error("Error submitting rankings:", error)
            toast.error("Failed to submit rankings. Please try again.")
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${window.location.origin}/game/${game!.id}`).then(() => {
            console.log("Link copied")
            toast.success("Game link copied")
        })
    };

    if (loading) {
        return (
            <div className="bg-bg min-h-screen flex items-center justify-center">
                <div className="text-white text-2xl font-mono">Loading...</div>
            </div>
        )
    }

    if (error || !game) {
        return (
            <div className="bg-bg min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-2xl font-mono mb-4">{error || "Game not found"}</div>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-yellow text-black px-6 py-2 rounded-full font-mono hover:bg-yellow-300 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    // Show identity modal for restrictive mode
    if (showIdentityModal && game.votingMode === 'restrictive') {
        return (
            <div className="bg-bg min-h-screen flex items-center justify-center">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-box p-8 rounded-xl max-w-md w-full mx-4 flex flex-col items-center justify-center">
                        <h2 className="text-white text-3xl font-mono mb-4 text-center">Select Your Identity</h2>
                        <p className="text-white text-xl font-sans mb-6 text-center">
                            This game uses restrictive voting. Please select who you are from the list below:
                        </p>

                        {identityError && (
                            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center font-mono">
                                {identityError}
                            </div>
                        )}

                        <div className="space-y-3">
                            {game.friends.map((friend) => {
                                const hasVoted = game.usersRanked.includes(friend);
                                const isDisabled = hasVoted;

                                return (
                                    <button
                                        key={friend}
                                        onClick={() => handleIdentitySelect(friend)}
                                        className={`w-full p-3 cursor-pointer rounded-lg font-sans text-2xl transition-colors ${isDisabled
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-yellow text-black hover:bg-box hover:border-yellow hover:border-2 hover:text-yellow'
                                            }`}
                                        disabled={isDisabled}
                                    >
                                        {friend} {hasVoted && '(Already voted)'}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="w-fit mx-auto mt-4 bg-gray-600 cursor-pointer text-white p-3 text-xl rounded-lg font-mono hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Don't show ranking interface if restrictive mode and no identity selected
    if (game.votingMode === 'restrictive' && !selectedIdentity) {
        // If user has already voted but we don't have their identity, show error
        if (isEditingVote) {
            return (
                <div className="bg-bg min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-2xl font-mono mb-4">
                            You have already voted in this game, but we couldn&apos;t retrieve your original identity.
                        </div>
                        <div className="text-white text-lg font-mono mb-6">
                            This might happen if you cleared your browser data or are using a different device.
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-yellow text-black px-6 py-2 rounded-full font-mono hover:bg-yellow-300 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="bg-bg min-h-screen flex items-center justify-center">
                <div className="text-white text-2xl font-mono">Please select your identity to continue...</div>
            </div>
        )
    }

    return (
        <div className="bg-bg min-h-screen pb-10 px-8 md:p-16 flex flex-col items-center justify-center">
            <div className="flex w-fit z-0 justify-center flex-col items-center">
                <div className="flex w-full justify-center flex-col items-center">
                    <div onClick={() => router.push("/")} className="bg-yellow my-2 flex items-center gap-4 border-b-4 border-white  hover:text-yellow  cursor-pointer duration-100 ease-in-out transition-all  hover:bg-transparent text-2xl text-black py-2 px-8 font-mono rounded-full mt-8">
                        <p>Home</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M5.25 6.31v9.44a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75h11.25a.75.75 0 0 1 0 1.5H6.31l13.72 13.72a.75.75 0 1 1-1.06 1.06L5.25 6.31Z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex z-10 mt-5 flex-col gap-4 w-full max-w-4xl mx-auto">
                <div className="flex justify-center items-center w-full gap-10">
                    <p className="text-white font-mono text-2xl">Code: <span className='text-green'>{game.id}</span> </p>
                    <button
                        onClick={copyToClipboard}
                        className="text-white bg-blue group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white px-3 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors"
                    >
                        <p className='text-white font-mono text-2xl group-hover:text-blue'>Share</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                    </button>
                </div>

                {/* Show editing indicator */}
                {isEditingVote && (
                    <div className="flex justify-center items-center w-full mt-2">
                        <p className="text-yellow font-mono text-xl">
                            ✏️ Editing your previous vote
                        </p>
                    </div>
                )}

                {/* Show selected identity in restrictive mode */}
                {game.votingMode === 'restrictive' && selectedIdentity && (
                    <div className="flex justify-center items-center w-full">
                        <p className="text-white font-mono text-xl">
                            Voting as: <span className='text-pink'>{selectedIdentity}</span>
                        </p>
                    </div>
                )}

                <div className="flex flex-col justify-start items-start">
                    <p className="text-white font-mono my-2 text-xl">
                        Category {`(${category + 1}/${categories.length}): `}
                        <motion.span
                            initial="reset"            // ensures it starts "reset"
                            animate={controls}         // drives it via controls.start(...)
                            variants={variants}        // has both reset & shake
                            style={{ display: "inline-block" }}  // allow rotation
                            // remove key={category}
                            className='bg-yellow text-black px-4 py-1 rounded-lg ml-3'
                        >
                            {categories[category]}
                        </motion.span>
                    </p>
                    <p className="text-white font-mono my-2 text-xl">
                        <span className='text-pink'>Drag</span> and <span className='text-green'>drop</span> the names to arrange it with your <span className='text-purple'>rankings</span>!
                    </p>
                </div>

                <Reorder.Group axis="y" values={names} onReorder={setNames} className="flex flex-col gap-2 w-full justify-center items-center">
                    {names.map((name, index) => (
                        <Reorder.Item key={name} value={name} className="text-white px-6 text-2xl py-2 bg-purple flex items-center justify-between rounded-xl font-mono w-fit text-center cursor-move">
                            <p className='text-white font-mono text-2xl'>{index + 1}. {name}</p>

                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <div className="flex justify-center items-start gap-4 flex-wrap">
                    {category !== 0 && (
                        <button
                            className="bg-green px-5 py-2  cursor-pointer border-b-2 rounded-full hover:bg-bg hover:border-green hover:text-green border-white transition-colors"
                            onClick={() => {
                                // Start shake animation
                                controls.start("start");

                                setTimeout(() => {
                                    const prevCategory = Math.max(category - 1, 0);
                                    setCategory(prevCategory);

                                    // Load previous vote data for previous category if available
                                    if (isEditingVote && rankings[categories[prevCategory]]) {
                                        setNames(rankings[categories[prevCategory]]);
                                    } else {
                                        // Shuffle the names array for the previous category
                                        const shuffledNames = [...game!.friends].sort(() => Math.random() - 0.5);
                                        setNames(shuffledNames);
                                    }

                                    // Stop shake animation
                                    controls.stop();
                                    controls.set("reset");
                                }, 300);
                            }}
                        >
                            <p className="text-darkest font-mono text-md">Previous Category</p>
                        </button>
                    )}
                    {category + 1 < categories.length && (
                        <button
                            className="bg-pink px-5 py-2  cursor-pointer border-b-2 rounded-full hover:bg-bg hover:border-pink hover:text-pink border-white transition-colors"
                            onClick={() => nextStep()}
                        >
                            <p className="text-darkest font-mono text-xl">Next Category</p>
                        </button>
                    )}
                    {!submitted && categories.length - 1 === category && (
                        <button
                            className="bg-yellow px-5 py-2  cursor-pointer border-b-2 rounded-full hover:bg-bg hover:border-yellow hover:text-yellow border-white transition-colors"
                            onClick={() => submitRankings()}
                        >
                            <p className="text-darkest font-mono text-xl">{isEditingVote ? 'Update' : 'Submit'}</p>
                        </button>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-white text-xl font-mono mb-4">
                        Voting Mode: <span className='text-blue'>{game.votingMode}</span>
                    </p>
                    <p className="text-white text-lg font-mono">
                        <span className='text-blue'>{game?.votesCount}</span> people have voted
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GamePage 
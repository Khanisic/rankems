"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGame } from '../../../lib/actions/rank.actions'
import { addGameToUserGames } from '../../../lib/util'
import toast from 'react-hot-toast'

function CreateRankem() {

    const router = useRouter()

    const [title, setTitle] = useState<string>("");
    const [friends, setFriends] = useState<string[]>(["Add", "Your", "Items", "Here"]);
    const [categories, setCategories] = useState<string[]>(["Most likely to..."]);

    const [friend, setFriend] = useState("")
    const [category, setCategory] = useState("")
    const [votingMode, setVotingMode] = useState("public") // "restrictive", "public", "private"
    const [showModal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [friendsInputFocused, setFriendsInputFocused] = useState(false)
    const [categoriesInputFocused, setCategoriesInputFocused] = useState(false)

    const create = async () => {
        try {
            setIsLoading(true)
            setError("")

            const gameId = await createGame(title, friends, categories, votingMode)

            if (gameId) {
                // Add game to user's games array in session storage
                addGameToUserGames(gameId)
                toast.success("Game created successfully")
                // Navigate to the game page        
                router.push(`/game/${gameId}`)
            } else {
                setError("Failed to create game. Please try again.")
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the game."
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const openModal = (content: string) => {
        setModalContent(content)
        setShowModal(true)
    }

    return (
        <div className='bg-bg min-h-screen px-8 pb-20  relative'>
            <head>
                <title>Create Rankem</title>
                <meta name="description" content="Create Rankem" />
                <meta name="keywords" content="Create Rankem" />
                <meta name="author" content="Abdul Moid Khan" />
                <link rel="icon" href="/favicon.ico" />
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

            <div className='flex flex-col items-center justify-center'>


                <p className='text-white text-5xl font-mono mt-5 text-center w-full'>Create a <span className='text-pink font-mono'>Rankem</span></p>

                {/* Title Section */}
                <div className="flex flex-col gap-4 mt-6 w-full max-w-md">
                    <p className="text-white font-mono text-2xl text-center">Title</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        className="outline-none placeholder:text-slate-200 text-white border-pink border-b-2 bg-transparent font-sans text-2xl py-2 text-center w-full"
                        placeholder="Enter a title for your rankem"
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-10 mt-8 justify-center">
                    <div className=" flex flex-col gap-4 justify-start">
                        <p className="text-white font-mono text-2xl ">Items</p>
                        <div className="flex gap-4 items-center ">
                            <input
                                value={friend}
                                onChange={(e) => setFriend(e.currentTarget.value)}
                                onFocus={() => {
                                    if (!friendsInputFocused) {
                                        setFriends([])
                                        setFriendsInputFocused(true)
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && friend.trim() !== "") {
                                        setFriends((prevFriends) => [...prevFriends, friend])
                                        setFriend("")
                                    }
                                }}
                                className="outline-none placeholder:text-slate-200 text-white border-lime border-b-2 bg-transparent font-sans text-2xl  py-2 self-start w-fit"
                                placeholder="Enter item title here"
                            />
                            <svg onClick={() => {
                                if (friend.trim() !== "") {
                                    setFriends((prevFriends) => [...prevFriends, friend])
                                    setFriend("")
                                }
                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-green cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>

                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                friends.map((friend, index) => {
                                    return (
                                        <div key={index} className=" text-2xl text-white items-center flex gap-2 group">
                                            <div className="text-lime font-mono">
                                                {index + 1}.
                                            </div>
                                            <div className="flex font-base justify-start w-fit px-3 py-1 text-2xl rounded-xl items-center bg-green self-start">
                                                {friend}
                                            </div>
                                            <div className="hidden group-hover:inline-block animate-bounce">

                                                <svg onClick={() => {
                                                    setFriends(currentFriends =>
                                                        currentFriends.filter((_, friendIndex) => friendIndex !== index)
                                                    );
                                                }
                                                } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>


                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4 justify-start">
                        <p className="text-white font-mono text-2xl ">Categories</p>
                        <div className="flex  items-center">
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.currentTarget.value)}
                                onFocus={() => {
                                    if (!categoriesInputFocused) {
                                        setCategories([])
                                        setCategoriesInputFocused(true)
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && category.trim() !== "") {
                                        setCategories((prevCategories) => [...prevCategories, category])
                                        setCategory("")
                                    }
                                }}
                                className="outline-none placeholder:text-slate-200 text-white border-lavender border-b-2 bg-transparent font-sans text-2xl  py-2 self-start w-fit"
                                placeholder="Enter category here"
                            />
                            <div onClick={() => {
                                if (category.trim() !== "") {
                                    setCategories((prevCategories) => [...prevCategories, category])
                                    setCategory("")
                                }
                            }} className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-purple cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                                </svg>
                                <p className='text-purple font-mono text-2xl'>+</p>
                            </div>



                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                categories.map((category, index) => {
                                    return (
                                        <div key={index} className=" text-2xl text-white items-center flex gap-2 group">
                                            <div className="text-lavender font-mono">
                                                {index + 1}.
                                            </div>
                                            <div className="flex font-base justify-start w-fit px-3 py-1 rounded-xl text-2xl items-center bg-purple self-start">
                                                {category}
                                            </div>

                                            <div className="hidden group-hover:inline-block animate-bounce">
                                                <svg onClick={() => {
                                                    setCategories(currentCategories =>
                                                        currentCategories.filter((_, categoryIndex) => categoryIndex !== index)
                                                    );
                                                }
                                                } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>


                                            </div>

                                            {/* Modal */}
                                            {showModal && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-bg border border-border-box rounded-lg p-6 max-w-md mx-4">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-pink text-center font-mono text-2xl">Voting Mode Info</h3>
                                                            <button
                                                                onClick={() => setShowModal(false)}
                                                                className="text-white cursor-pointer hover:text-gray-300 transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <p className="text-white font-sans text-2xl leading-6">
                                                            {modalContent}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* Voting Mode Selection */}
                <div className="flex flex-col gap-4 mt-8 w-full max-w-2xl justify-center">
                    <p className="text-white font-mono text-3xl text-center">Select Voting Mode</p>
                    <div className="flex flex-col gap-4 ">
                        <label className="flex items-center  gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="votingMode"
                                value="restrictive"
                                checked={votingMode === "restrictive"}
                                onChange={(e) => setVotingMode(e.target.value)}
                                className="w-5 h-5 text-green bg-transparent border-2 border-green rounded focus:ring-green"
                            />
                            <div className="flex items-center gap-2">
                                <p className="text-white font-sans text-2xl">Restrictive</p>
                                <span
                                    onClick={() => openModal("Check this if you are ranking your friends and only want them to rank. Each friend would be prompted their name and they must choose from the friends that you have entered.")}
                                    className='text-blue mb-1 font-mono text-2xl cursor-pointer hover:text-blue-300 transition-colors'
                                >
                                    ?
                                </span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="votingMode"
                                value="public"
                                checked={votingMode === "public"}
                                onChange={(e) => setVotingMode(e.target.value)}
                                className="w-5 h-5 text-green bg-transparent border-2 border-green rounded focus:ring-green"
                            />
                            <div className="flex items-center gap-2">
                                <p className="text-white font-sans text-2xl">Public</p>
                                <span
                                    onClick={() => openModal("Anyone can vote here. This is the default mode and the title can be searched by anyone.")}
                                    className='text-blue mb-1 font-mono text-2xl cursor-pointer hover:text-blue-300 transition-colors'
                                >
                                    ?
                                </span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="votingMode"
                                value="private"
                                checked={votingMode === "private"}
                                onChange={(e) => setVotingMode(e.target.value)}
                                className="w-5 h-5 text-pink bg-transparent border-2 border-pink rounded focus:ring-pink"
                            />
                            <div className="flex items-center gap-2">
                                <p className="text-white font-sans text-2xl">Private</p>
                                <span
                                    onClick={() => openModal("Can only vote if link is shared.")}
                                    className='text-blue mb-1 font-mono text-2xl cursor-pointer hover:text-blue-300 transition-colors'
                                >
                                    ?
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {
                    !title.trim() &&
                    <p className="text-white text-3xl font-base text-center mt-4 w-full">Title is required to create</p>
                }

                {
                    friends.length < 5 &&
                    <p className="text-white text-3xl font-base text-center mt-4 w-full">{5 - friends.length} more item(s) required to create</p>
                }

                {
                    categories.length < 1 &&
                    <p className="text-white text-3xl font-base text-center mt-4 w-full">{1 - categories.length} more category(s) required to create</p>
                }

                {
                    title.trim() && friends.length > 4 && categories.length > 0 &&

                    <div className="flex w-full justify-center flex-col items-center">
                        <div
                            onClick={() => create()}
                            className={`my-2 cursor-pointer duration-100 ease-in-out transition-all text-2xl py-2 px-8 font-mono rounded-full mt-8 ${isLoading
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-pink hover:border-pink hover:text-pink hover:border-2 hover:bg-transparent text-white'
                                }`}
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </div>
                        {error && (
                            <p className="text-red-500 text-xl font-mono mt-4 text-center">
                                {error}
                            </p>
                        )}
                    </div>
                }

            </div>
        </div>
    )
}

export default CreateRankem
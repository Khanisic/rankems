import React, { useState } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function Popular() {
    const [data, setData] = useState([
        {
            name: "Ousmane Dembele",
            rank: 1,
            increase: true,
            decrease: false,
        },
        {
            name: "Kylian Mbappé",
            rank: 2,
            increase: false,
            decrease: true,
        },
        {
            name: "Lamine Yamal",
            rank: 3,
            increase: false,
            decrease: true,
        },
        {
            name: "Vitinha",
            rank: 4,
            increase: false,
            decrease: false,
        },
        {
            name: "Nuno Mendes",
            rank: 5,
            increase: false,
            decrease: true,
        },
    ])

    const [showCursorAnimation, setShowCursorAnimation] = useState(true)
    const [showSubmitCursor, setShowSubmitCursor] = useState(false)

    // useEffect(() => {
    //     // Hide the animation after 5 seconds
    //     const timer = setTimeout(() => {
    //         setShowCursorAnimation(false)
    //     }, 5000)

    //     return () => clearTimeout(timer)
    // }, [])

    const handleReorder = (newOrder: typeof data) => {
        setData(newOrder.map((player, index) => ({
            ...player,
            rank: index + 1
        })))
        // Hide cursor animation when user starts reordering
        setShowCursorAnimation(false)
        // Show submit cursor after reordering
        setShowSubmitCursor(true)
    }

    const AnimatedCursor = () => (
        <AnimatePresence>
            {showCursorAnimation && (
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
                    {/* <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.5,
                        }}
                        className="absolute top-[450px] left-1/2 transform -translate-x-1/2 text-green text-lg bg-bg px-4 py-2 rounded-full whitespace-nowrap font-medium"
                    >
                        Drag to reorder rankings!
                    </motion.div> */}
                </motion.div>
            )}
        </AnimatePresence>
    )

    const SubmitCursor = () => (
        <AnimatePresence>
            {showSubmitCursor && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none z-50"
                    style={{ top: '450px', right: '0px' }}
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
                    {/* <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.5,
                        }}
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-green bg-opacity-90 px-3 py-1 rounded-full whitespace-nowrap font-medium"
                    >
                        Submit your ranking!
                    </motion.div> */}
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="flex relative flex-col items-center justify-center pt-10 w-[500px] mx-auto">
            <AnimatedCursor />
            <SubmitCursor />
            <div className="flex gap-3 items-center justify-between w-full">
                <p className="font-mono text-white text-4xl">2025 Ballon d&apos;or</p>
                <div className="flex gap-3 items-center cursor-pointer group">
                    <p className="font-base text-green text-2xl">Next</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 transition-all ease-in-out duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>

                </div>

            </div>

            <div className="flex flex-col gap-3 items-center justify-center pt-5 w-full">
                <Reorder.Group axis="y" values={data} onReorder={handleReorder} className="w-full flex flex-col gap-3">
                    {data.map((player) => {
                        return (
                            <Reorder.Item
                                key={player.name}
                                value={player}
                                whileDrag={{ scale: 1.05, zIndex: 10 }}
                                className="flex gap-3 items-center cursor-grab active:cursor-grabbing group bg-box border-1 border-border-box rounded-full px-5 py-2 w-full justify-between"
                            >
                                <div className="flex gap-3 items-center">
                                    <p className="font-base text-white text-2xl">{player.rank}.</p>
                                    {player.increase &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }

                                    {player.decrease &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    }

                                    {!player.increase && !player.decrease &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                                            <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                        </svg>

                                    }

                                </div>
                                <p className="font-base text-white text-2xl w-full text-center pr-12">{player.name}</p>
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
                    <p className="font-base text-white text-xl">3569</p>
                </div>

                <button 
                    onClick={() => setShowSubmitCursor(false)}
                    className="flex gap-3 items-center bg-white hover:bg-bg border-2 cursor-pointer transition-all ease-in-out duration-300 border-white hover:border-white rounded-full px-5 py-1 group"
                >
                    <p className="font-base text-bg text-xl group-hover:text-white">Submit</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 group-hover:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>


                </button>
            </div>
        </div>
    )
}

export default Popular
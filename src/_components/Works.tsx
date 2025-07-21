import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import TrianglesWorks from './TrianglesWorks'
import { motion, AnimatePresence } from 'framer-motion'

function Works() {
    const worksData = [
        {
            create: "/works/friends-create.svg",
            rank: "/works/friends-rank.svg",
            result: "/works/friends-result.svg",
        },
        {
            create: "/works/basketball-create.svg",
            rank: "/works/basketball-rank.svg",
            result: "/works/basketball-result.svg",
        },
        {
            create: "/works/vacation-create.svg",
            rank: "/works/vacation-rank.svg",
            result: "/works/vacation-result.svg",
        }
    ]

    const [works, setworks] = useState(worksData[1] || { create: "", rank: "", result: "" })
    const [currentIndex, setCurrentIndex] = useState(1)

    useEffect(() => {
        let index = 1
        const interval = setInterval(() => {
            index = index === 2 ? 0 : index + 1
            setworks(worksData[index] || { create: "", rank: "", result: "" })
            setCurrentIndex(index)
        }, 4000)

        return () => clearInterval(interval)
    }, [])


    return (
        <div className='w-full h-full flex flex-col justify-center gap-1 items-center max-w-7xl mx-auto px-5 py-20 md:px-10 md:py-10'>
            <div className="relative z-0 w-full flex items-center justify-center">
                <TrianglesWorks />
                <p className="text-white font-mono text-3xl z-10 md:text-6xl mt-10 mb-2 text-center">How it <span className="text-pink">Works</span></p>
            </div>

            <div className='flex flex-col md:flex-row justify-around items-center'>
                <div className='w-full md:w-1/2 h-full flex flex-col justify-center text-center items-start px-5 md:px-10'>
                    <p className='text-2xl md:text-5xl text-yellow font-mono w-full'>Create</p>
                    <p className='text-xl md:text-3xl text-white font-lond w-full'>A RANKEM IS CREATED BY ANYONE</p>
                    <p className='text-lg md:text-2xl text-yellow-light font-lond w-full'>Items are added, categories are selected and lastly the mode in which the rankings would be taken is setup. Items could be anything, your friends, if you wish to rank them or even your groceries if you want people to rank on which is the ugliest.</p>
                </div>
                <div className='w-full md:w-1/2 h-full gap-10 flex justify-center items-center'>
                    <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[330px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`create-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image src={works.create} alt="create" fill className="object-contain" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className='flex flex-col-reverse md:flex-row justify-around items-center'>
                <div className='w-full md:w-1/2 h-full gap-10 flex justify-center items-center'>
                    <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[350px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`rank-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image src={works.rank} alt="rank" fill className="object-contain" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                <div className='w-full md:w-1/2 h-full  flex flex-col justify-center text-center items-start px-5 md:px-10'>
                    <p className='text-2xl md:text-5xl text-pink font-mono w-full'>Ranking</p>
                    <p className='text-xl md:text-3xl text-white font-lond w-full'>A RANKEM IS RANKED BY *ANYONE</p>
                    <p className='text-lg md:text-2xl text-pink-light font-lond w-full'>Items are then ranked based on the category, users can drag and drop the items based on their desired rankings. If the mode is set to restricted, then users are asked to select who they are from the created items.</p>
                    <p className='text-sm text-white font-lond w-full'>*public mode, if private and restricted then to whom the link is shared.</p>
                </div>

            </div>
            <div className='flex flex-col md:flex-row justify-around items-center'>
                <div className='w-full md:w-1/2 h-full flex flex-col justify-center text-center items-start px-5 md:px-10'>
                    <p className='text-2xl md:text-5xl text-green font-mono w-full'>RESULTS</p>
                    <p className='text-xl md:text-3xl text-white font-lond w-full'>RESULTS ARE CALCULATED BY US</p>
                    <p className='text-lg md:text-2xl text-green-light font-lond w-full'>Points are awarded based on what users rank the items, if there are 6 items then the item ranked first is given 6 points and item ranked 5th is given 5 points and so on...</p>
                </div>
                <div className='w-full md:w-1/2 h-full gap-10 flex justify-center items-center'>
                    <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`result-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image src={works.result} alt="result" fill className="object-contain" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className='flex flex-col-reverse md:flex-row justify-around items-center'>
                <div className='w-full md:w-1/2 h-full gap-10 flex justify-center items-center'>
                    <Image src="/works/voting-as.svg" alt="voting as" width={500} height={500} />
                </div>
                <div className='w-full md:w-1/2 h-full  flex flex-col justify-center text-center items-start px-5 md:px-10'>
                    <p className='text-2xl md:text-5xl text-blue font-mono w-full'>RESTRICTED MODE</p>
                    <p className='text-xl md:text-3xl text-white font-lond w-full'>RECOMMENDED FOR FRIEND GROUPS</p>
                    <p className='text-lg md:text-2xl text-blue-light font-lond w-full'>If you are ranking among your friends, then only your friends can rank, they are prompted to select which friend (item) they are before ranking.</p>
                </div>

            </div>
        </div>
    )
}

export default Works
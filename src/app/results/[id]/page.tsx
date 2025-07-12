"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchGame, fetchResults } from '../../../../lib/actions/rank.actions'
import { motion, useAnimation } from 'framer-motion'
import toast from 'react-hot-toast'

interface Game {
  id: string
  friends: string[]
  categories: string[]
  votingMode: string
  usersRanked: string[]
  votesCount: number
  createdAt: string
  updatedAt: string
}

interface Ranking {
  friend: string
  points: number
  increase: boolean
  decrease: boolean
}

interface CategoryResult {
  category: {
    name: string
    results: Ranking[]
  }
}

interface Results {
  id: string
  votesCount: number
  results: CategoryResult[]
  published: boolean
  createdAt: string
  updatedAt: string
}

const variants = {
  reset: { rotate: 0 },
  shake: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.7, repeat: 0 }    // one-time shake
  }
};

function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(0)
  const controls = useAnimation()
  useEffect(() => {
    // skip on mount if you like:
    if (results?.results.length) {
      controls
        .start("shake")
        .then(() => controls.start("reset"))
    }
  }, [selectedCategory])

  useEffect(() => {
    const loadData = async () => {
      try {
        if (params.id) {
          const [gameData, resultsData] = await Promise.all([
            fetchGame(params.id as string),
            fetchResults(params.id as string)
          ])

          if (gameData) {
            setGame(gameData)
            if (resultsData) {
              console.log(resultsData)
              setResults(resultsData)
            } else {
              // If no results yet, show a message
              setError("No votes have been submitted yet")
            }
          } else {
            setError("Game not found")
          }
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load results"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/results/${game!.id}`).then(() => {
      console.log("Results link copied")
      toast.success("Game results link copied")
    })
  }

  if (loading) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-mono">Loading results...</div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl font-mono mb-4">{error || "Results not found"}</div>
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

  if (!results) {
    return (
      <div className="bg-bg min-h-screen py-20 px-8 md:p-16">
        <div className="flex fixed top-0  w-fit z-0 justify-center flex-col items-center">
          <div
            onClick={() => router.push("/")}
            className="bg-yellow my-2 flex items-center gap-4 hover:border-yellow hover:text-yellow hover:border-2 cursor-pointer duration-100 ease-in-out transition-all hover:bg-transparent text-xl text-black py-2 px-8 font-mono rounded-full mt-8"
          >
            <p>Home</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M5.25 6.31v9.44a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75h11.25a.75.75 0 0 1 0 1.5H6.31l13.72 13.72a.75.75 0 1 1-1.06 1.06L5.25 6.31Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
          <div className="flex justify-center w-full gap-2">
            <p className="text-white font-mono text-2xl">Game Code: {game.id}</p>
          </div>

          <div className="text-center mt-20">
            <p className="text-white text-3xl font-mono mb-6">No votes submitted yet!</p>
            <p className="text-white text-xl font-mono mb-8">Be the first to vote and see the results.</p>
            <button
              onClick={() => router.push(`/game/${game.id}`)}
              className="bg-pink hover:border-pink hover:text-pink hover:border-2 cursor-pointer duration-100 ease-in-out transition-all hover:bg-transparent text-xl text-white py-2 px-6 font-mono rounded-full"
            >
              Vote Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentCategoryResults = results.results[selectedCategory]

  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center pb-10 px-8 md:p-16">
      <div className="flex w-fit z-0 justify-center flex-col items-center">
        <div
          onClick={() => router.push("/")}
          className="bg-yellow my-2 flex items-center gap-4 hover:border-yellow hover:text-yellow hover:border-2 cursor-pointer duration-100 ease-in-out transition-all hover:bg-transparent text-xl text-black py-2 px-8 font-mono rounded-full mt-8"
        >
          <p>Home</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M5.25 6.31v9.44a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75h11.25a.75.75 0 0 1 0 1.5H6.31l13.72 13.72a.75.75 0 1 1-1.06 1.06L5.25 6.31Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
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

        <div className="flex items-center justify-center">
          <p className='text-white font-mono text-2xl'>Category: {`(${selectedCategory + 1}/${results.results.length})`}</p>
          <motion.span
            initial="reset"            // ensures it starts “reset”
            animate={controls}         // drives it via controls.start(...)
            variants={variants}        // has both reset & shake
            style={{ display: "inline-block" }}  // allow rotation
            // remove key={category}
            className='bg-yellow text-black text-center font-mono px-4 py-1 rounded-lg ml-3 text-2xl'
          >
            {currentCategoryResults.category.name}
          </motion.span>
        </div>

        <div className="flex flex-col gap-2 w-full justify-center items-center">
          {currentCategoryResults.category.results.map((ranking, index) => (
            <div key={ranking.friend} className="text-white px-6 py-1 bg-box border-border-box border-1 rounded-full font-mono w-fit text-center flex items-center gap-2">
              <div className="flex gap-3 items-center">
                <p className="font-base text-white text-2xl">{index + 1}.</p>
                {ranking.increase &&
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green group-hover:translate-x-1 rotate-180 transition-all ease-in-out duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }

                {ranking.decrease &&
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red transform group-hover:translate-x-1 transition-all ease-in-out duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }

                {!ranking.increase && !ranking.decrease &&
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 stroke-2 stroke-purple">
                    <path fillRule="evenodd" d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>

                }

              </div>
              <div className="text-white px-6 py-1 rounded-xl font-sans text-2xl w-fit text-center">{ranking.friend}</div>
              <div className="text-lg text-white font-sans">( {ranking.points} pts )</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-start gap-4 flex-wrap">
          {selectedCategory !== 0 && (
            <button
              className="bg-green px-5 py-2  cursor-pointer border-b-2 rounded-full hover:bg-bg hover:border-green hover:text-green border-white transition-colors"
              onClick={() => {
                controls.start("shake")
                  .then(() => controls.start("reset"))
                setSelectedCategory((cat) => Math.max(cat - 1, 0))
              }}
            >
              <p className="text-darkest font-mono text-md">Previous</p>
            </button>
          )}
          {selectedCategory + 1 < results.results.length && (
            <button
              className="bg-pink px-5 py-2  cursor-pointer border-b-2 rounded-full hover:bg-bg hover:border-pink hover:text-pink border-white transition-colors"
              onClick={() => {
                controls.start("shake")
                  .then(() => controls.start("reset"))
                setSelectedCategory((cat) => Math.min(cat + 1, results.results.length - 1))
              }}
            >
              <p className="text-darkest font-mono text-md">Next</p>
            </button>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-white text-xl font-mono mb-4">
            Voting Mode: <span className='text-green'>{game.votingMode}</span>
          </p>
          <p className="text-white text-lg font-mono mb-2">
            {results.votesCount} votes submitted
          </p>
        </div>
        <div className="flex justify-center items-center w-full gap-10">
          <button
            className="text-white bg-pink group hover:bg-bg border-b-2 hover:border-pink  hover:text-pink border-white px-5 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors"
            onClick={() => router.push(`/game/${game.id}`)}
          >
            <p className='text-white font-mono text-2xl group-hover:text-pink'>Vote Now</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-pink transition-all ease-in-out duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>
      </div>
    </div >
  )
}

export default ResultsPage 
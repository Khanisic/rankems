/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { motion } from 'framer-motion'

function TrianglesWorks() {
    const floatTransition = {
        y: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },
        x: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },

        rotate: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },
    };


    return (
        <div
            className="md:flex hidden absolute items-center justify-center gap-[500px] w-full -z-10 "
        >
            <motion.div animate={{ y: [0, -10, 0], x: [0, 10, 0], rotate: [0, 16, 0] }}
                transition={floatTransition as any} className="w-0 h-0 translate-y-[20px]  -rotate-5 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-t-[120px] border-t-red"></motion.div>
            <motion.div animate={{ y: [0, -10, 0], x: [0, 10, 0], rotate: [0, 20, 0] }}
                transition={floatTransition as any} className="w-0 h-0 translate-y-[-50px] translate-x-[10px] -rotate-25 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[120px] border-b-green"></motion.div>

        </div>
    )
}

export default TrianglesWorks
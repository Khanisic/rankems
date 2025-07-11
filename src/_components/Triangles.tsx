"use client"
import React from 'react'
import { motion } from 'framer-motion'

function Triangles() {
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
    };


    return (
        <motion.div
            className="md:flex hidden absolute items-center justify-center top-[60px] left-[200px]"
            animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
            transition={floatTransition}
        >
            <div className="w-0 h-0 translate-y-[-10px] translate-x-[10px] -rotate-35 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[120px] border-b-green"></div>
            <div className="w-0 h-0 translate-y-[60px] translate-x-[10px] -rotate-35 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-t-[120px] border-t-red"></div>
        </motion.div>
    )
}

export default Triangles
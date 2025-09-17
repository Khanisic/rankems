
"use client"
import Triangles from "@/_components/Triangles";
import Trophies from "@/_components/Trophies";
import Popular from "@/_components/Popular";
import Live from "@/_components/Live";
import Image from "next/image";
import Link from "next/link";
import Works from "@/_components/Works";



export default function Home() {

  return (
    <div className="bg-bg min-h-screen pb-30">
      <Triangles />

      <Trophies />
      <div className="md:flex hidden absolute md:left-[-200px] xl:left-[-100px] 2xl:left-[-50px] items-center justify-center top-[350px]">
        <Image src="/popular.svg" alt="ballon d'or" width={500} height={500} />
        <p className="font-base text-white text-xl -translate-x-[210px] translate-y-[-160px] rotate-[15deg]">Featured right now!</p>
      </div>

      <div className="md:py-6 py-4 z-10">
        <p className="text-pink font-mono m-0 z-10 text-5xl lg:text-7xl text-center leading-[80px] pt-4">Rank Em Up</p>
        <p className="text-white font-base text-xl lg:text-2xl px-6 text-center z-10">An application where you rank <span className="text-yellow">anything</span> based on <span className="text-purple">anything</span>. </p>
        <div className="flex md:flex-row flex-col z-10 gap-8 items-center justify-center pt-5">
          <Link href="/create">
            <button className="text-white relative z-20 bg-blue group hover:bg-bg border-b-2 hover:border-blue  hover:text-blue border-white md:px-6 px-4 py-1 rounded-full w-full flex gap-2 items-center cursor-pointer transition-colors">
              <p className="text-white font-mono md:text-xl text-lg group-hover:text-blue">Create Now</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              <p className="text-white font-sans w-full md:text-sm text-xs text-center absolute top-11 left-0">Its free, no signup required!!</p>
            </button>
          </Link>
          <Link href="/my-rankems">
            <button className="text-white bg-purple group z-40 hover:bg-bg border-b-2 hover:border-purple  hover:text-purple border-white md:px-6 px-4 py-1 rounded-full flex gap-2 items-center cursor-pointer transition-colors" >
              <p className="text-white font-mono md:text-xl text-lg group-hover:text-purple">My Rankems</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-hover:text-white transition-all ease-in-out duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>

            </button>
          </Link>


        </div>

        <Popular />
      </div>

      <Works />
      <Live />
    </div >
  );
}

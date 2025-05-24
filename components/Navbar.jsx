"use client"
import React from 'react'
import Image from 'next/image'
import NavMenu from './NavMenu'
import { useState } from 'react'
import { IoMenuOutline, IoTrophyOutline } from "react-icons/io5";
import { PiTarget, PiFlagBanner } from "react-icons/pi";
import { BsPeople } from "react-icons/bs";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Link from 'next/link'


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuData = {
        "About Us": {
            title: "About Us",
            description: "Learn about our vision and the passionate team organizing the event.",
            caption: "EXPLORE",
            items: [
                { icon: <IoMdInformationCircleOutline  size={20} />, label: "Our Event", link:'/about'},
                { icon: <PiFlagBanner size={20} />, label: "Highlights", link:'/about' },
                { icon: <BsPeople size={20} />, label: "Our Team", link:'/about'},
                { icon: <PiTarget size={20} />, label: "Our Purpose", link:'/about'},
                { icon: <IoTrophyOutline size={20} />, label: "Our Achievements", link:'/about' },
            ]
        },
    };

    function handleMenu() {
        setMenuOpen(!menuOpen);
    }

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <div className='relative'>
            <div className='hidden lg:block absolute left-0 top-0 z-30 w-screen h-20'>
                <div className='flex flex-row justify-between items-center px-16 h-full'>
                    <div className='flex navMainItem z-20'>
                        {/* <Image
                            src='/images/logo.png'
                            width={120}
                            height={120}
                            alt='CCDS TOP Logo'
                            className='object-fit mt-1 w-auto h-auto'
                        /> */}
                    </div>
                    <NavMenu menuData={menuData} />
                    {/* <div className='flex gap-7 items-center z-20'>
                        <Link href='/game' className='flex navMainItem'>Play</Link>
                        <Link href='/signup' className='flex navButton'>Play</Link>
                    </div> */}
                </div>
            </div>
            <div className='lg:hidden w-screen flex fixed top-0 left-0 right-0 z-30 h-12'>
                <div className='flex items-center justify-center w-full h-full mx-4 mt-4'>
                    <div className='flex items-center justify-between gap-4 w-full h-full navMenuContainer pr-2 pl-4'>
                        {/* <div className='flex h-full navMainItem items-center'>
                            <Image
                                src='/images/logosquare.png'
                                width={40}
                                height={40}
                                alt='CCDS Top Logo'
                                className='object-fit w-auto h-[80%]'
                            />
                        </div> */}
                        <button onClick={handleMenu} className='px-2 py-1 rounded-full'>
                            <IoMenuOutline size={24} className={`flex `} />
                        </button>
                    </div>
                </div>
            </div>
            <div className={`lg:hidden fixed w-screen h-screen bg-black bg-repeat-y z-[25] pt-24 px-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ease-in-out`}>
                <div className='flex flex-col gap-4'>
                    <Link href='/' className='flex font-homevideo uppercase tracking-widest' onClick={handleLinkClick}>Home</Link>
                    <div className='menuDivider' />
                    <Link href='/game' className='flex font-homevideo uppercase tracking-widest' onClick={handleLinkClick}>About Us</Link>
                    <div className='menuDivider' />
                    <Link href='/game' className='flex font-homevideo uppercase tracking-widest' onClick={handleLinkClick}>Leaderboard</Link>
                    <div className='menuDivider' />
                    <Link href='/game' className='flex font-homevideo uppercase tracking-widest' onClick={handleLinkClick}>Poker</Link>
                    <div className='menuDivider' />
                    <Link href='/game' className='flex font-homevideo uppercase tracking-widest' onClick={handleLinkClick}>FAQs</Link>
                    <div className='menuDivider' />
                </div>
            </div>
        </div>
    )
}

export default Navbar

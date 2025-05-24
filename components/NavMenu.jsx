"use client";
import { useState } from 'react';
import { AnimatePresence, motion, circInOut } from 'framer-motion';
import Link from 'next/link';

function NavMenu({menuData}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = (menu) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
    setTimeoutId(id);
  };



  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-20">
      <div className="relative flex items-center justify-center h-full">
        <div className="flex justify-between gap-4 navMenuContainer px-6">
          <Link href='/' className="flex navMenuItem">Home</Link>
          <div
            className="flex navMenuItem"
            onMouseEnter={() => handleMouseEnter("About Us")}
            onMouseLeave={handleMouseLeave}
          >
            About Us
          </div>
          <Link href='/recruitment' className="flex navMenuItem">Leaderboard</Link>
          <Link href='/recruitment' className="flex navMenuItem">Poker</Link>
          <Link href='/faqs' className="flex navMenuItem">FAQs</Link>
        </div>

        <AnimatePresence>
          {activeMenu && menuData[activeMenu] && (
            <motion.div
              className="absolute grid grid-cols-2 divide-x top-[90%] navDropdownMenuContainer w-1/2 bg-white"
              initial={{ opacity: 0, scaleY: 0, scaleX: 0}}
              animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleY: 0, scaleX: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.77, 0, 0.175, 1],
              }}
              onMouseEnter={() => handleMouseEnter(activeMenu)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="navDropdownMenuBox">
                <h3 className="flex w-full font-semibold uppercase mb-2">{menuData[activeMenu].title}</h3>
                <p className="flex w-full">{menuData[activeMenu].description}</p>
              </div>
              <div className="navDropdownMenuBox">
                <p className="navDropdownCaption">{menuData[activeMenu].caption}</p>
                {menuData[activeMenu].items.map((item, index) => (
                  <Link href={item.link} key={index} className="navDropdownMenuItem">
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NavMenu;

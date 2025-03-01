'use client';

import React, { useState, useEffect } from 'react';
import DesktopLink from './ui/desktopLink';
import MobileLink from './ui/mobileLink';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FiFilter } from 'react-icons/fi';
import { useInsectFilter } from '../hooks/useInsectFilter';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { setIsDrawerOpen } = useInsectFilter();
    const [showFilterIcon, setShowFilterIcon] = useState(false);

    const openHandler = () => setIsOpen(!isOpen);

    const [color, setColor] = useState('transparent');
    const [desktopTextColor, setDesktopTextColor] = useState('white'); // Desktop link colors
    const [navbarTextColor, setNavbarTextColor] = useState('white'); // Navbar icons & links (not mobile menu)
    const mobileIconColor = isOpen ? 'white' : navbarTextColor; // Ensure white icons when menu is open

    useEffect(() => {
        const handleScroll = () => {
            const insectsSection = document.getElementById('insects-section');
            if (insectsSection) {
                const rect = insectsSection.getBoundingClientRect();
                setShowFilterIcon(rect.top < window.innerHeight && rect.bottom > 0);
            }

            if (window.scrollY >= 90) {
                setColor('#ffffff'); // Navbar background becomes white
                setDesktopTextColor('#000000'); // Desktop links turn black
                setNavbarTextColor('#000000'); // Mobile icons turn black
            } else {
                setColor('transparent'); // Default state
                setDesktopTextColor('white'); // Desktop links stay white
                setNavbarTextColor('white'); // Mobile icons stay white
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ backgroundColor: color }} className="fixed top-0 left-0 w-full ease-in duration-300 z-50">
            <div className="max-w-[1280px] m-auto flex justify-between items-center p-4">
                {/* Desktop Links (Only these change color on scroll) */}
                <ul className="hidden md:flex gap-8" style={{ color: desktopTextColor }}>
                    {LINKS.map(link => (
                        <li key={link.id}>
                            <DesktopLink title={link.title} path={link.path}/>
                        </li>
                    ))}
                </ul>
                {/* Mobile Controls */}        
                <div className="md:hidden flex w-full justify-between items-center z-50">
                    <div onClick={openHandler}>
                        {isOpen ? (
                            <AiOutlineClose size={26} style={{ color: mobileIconColor }} />
                        ) : (
                            <AiOutlineMenu size={26} style={{ color: mobileIconColor }} />
                        )}
                    </div>
                    {showFilterIcon && (
                      
                        
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-1 relative flex items-center justify-center"
                            aria-label="Open filters"
                        >
                            <FiFilter size={24} style={{ color: mobileIconColor }} />
                        </button>
                        
                    )}
                </div>
                {/* Mobile Menu (Force White Text & Icons) */}
                <div className={
                    isOpen 
                        ? 'sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black/60 backdrop-blur-xl ease-in duration-300 text-white'
                        : 'sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black/60 backdrop-blur-xl ease-in duration-300'
                }>
                    <ul className="flex flex-col gap-8 items-center">
                        {LINKS.map(link => (
                            <li onClick={openHandler} key={link.id} className="text-white">
                                <MobileLink title={link.title} path={link.path} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

const LINKS = [
    { id: 1, title: 'Home page', path: '/' },
    { id: 2, title: 'Insects', path: '#insects-section' },
    { id: 3, title: 'Areas', path: '/areas' },
    { id: 4, title: 'About', path: '/about' },
];

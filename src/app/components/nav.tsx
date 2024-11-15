'use client'

import React, { useState, useEffect } from 'react';
import DesktopLink from './ui/desktopLink';
import MobileLink from './ui/mobileLink';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openHandler = () => {
      setIsOpen(!isOpen)
    }

    const [color, setColor ] = useState('transparent')
    const [textColor, setTextColor ] = useState('white')


    useEffect(()=> {
      const changeColor = () => {
        if(window.scrollY >= 90) {
          setColor('#ffffff');
          setTextColor('#000000');
        } else {
          setColor('transparent');
          setTextColor('white');
        }
      };
      window.addEventListener('scroll', changeColor);
    }, []); 

  return (
    <div style={{backgroundColor: `${color}`}}className="fixed top-0 left-0 w-full ease-in duration-300 z-10" >
      <div className="max-w-[1280px] m-auto flex justify-between items-center p-4 text-white">
       
        {/* Desktop links */}
        <ul style={{color: `${textColor}`}} className='hidden sm:flex gap-8'>
          {LINKS.map(link => (
          <li key={link.id}><DesktopLink title={link.title} path={link.path} /></li>
          ))}
        </ul>
      
      <div onClick={openHandler} className='sm:hidden block z-10'>
      
      {isOpen ? ( <AiOutlineClose size={20}/> ) : ( <AiOutlineMenu style={{color:`${textColor}`}} size={20}/>) }
      </div>
      {/* Mobile links */}
      <div className={isOpen ? ('sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black/60 backdrop-blur-xl  ease-in duration-300')
        : ( 'sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black/60 backdrop-blur-xl ease-in duration-300' )  }>    
        <ul className='flex flex-col gap-8 items-center'>
          {LINKS.map(link => (
            <li onClick={openHandler} key={link.id}><MobileLink title={link.title} path={link.path} /></li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Navbar;

const LINKS = [
  { id: 1, title: 'Home page', path: '/'},
  { id: 2, title: 'Insects', path: '/hikes' },
  { id: 3, title: 'Areas', path: '/areas' },
  { id: 4, title: 'About', path: '/about' },
];



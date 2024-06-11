'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {

  const path = usePathname()

  useEffect(() => {
    console.log(path)
  }, [])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Image src={"./logo.svg"} alt='logo' width={160} height={100} />
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard' ? 'text-primary font-bold' : 'text-black'}
            `}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/questions' ? 'text-primary font-bold' : 'text-black'}
            `}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/upgrade' ? 'text-primary font-bold' : 'text-black'}
            `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/help' ? 'text-primary font-bold' : 'text-black'}
            `}>Help</li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Header
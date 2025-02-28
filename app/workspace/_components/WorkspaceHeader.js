import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

function WorkspaceHeader({ fileName }) {
  return (
    <div className='p-3 mb-1 flex justify-between shadow-md'>
      <Link href="/dashboard">
        <Image src={'/logoo.jpg'} alt='logo' width={140} height={100} className="cursor-pointer" />
      </Link>
      <h2 className='font-bold text-center'>{fileName}</h2>
      <div className="flex gap-2 items-center">
        <UserButton />
      </div>
    </div>
  )
}

export default WorkspaceHeader
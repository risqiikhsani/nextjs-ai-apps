import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='contaier mx-auto flex flex-col justify-center items-center pt-20'>
      <Button asChild>
        <Link href={"/chat"}>Chat</Link>
      </Button>
    </div>
  )
}

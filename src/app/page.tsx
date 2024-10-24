import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='contaier mx-auto flex flex-col justify-center items-center pt-20 gap-10'>
      <Button asChild>
        <Link href={"/chat"}>Chat basic</Link>
      </Button>
      <Button asChild>
        <Link href={"/chat-conv"}>Chat conversation AI</Link>
      </Button>
      <Button asChild>
        <Link href={"/text-to-image"}>Image Generator</Link>
      </Button>
    </div>
  )
}

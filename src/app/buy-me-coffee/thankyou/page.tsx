import { Button } from '@/components/ui/button'
import { SmileIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Renders a thank you page with a message and a button to navigate back to the home page.
 */

/******  68540068-3641-4a9b-b129-e72a80a3f363  *******/
export default function Page() {
  return (
    <div className='container flex flex-col gap-10 items-center'>
        <div className='text-4xl font-bold text-center flex items-center gap-2'>Thank you for your support <SmileIcon/></div>
        <div className='text-4xl font-bold text-center flex items-center gap-2'>This support means a lot to us. <SmileIcon/></div>
        <Button asChild><Link href="/">Back to home</Link></Button>
    </div>
  )
}


import PageHeader from '@/components/PageHeader'
import React from 'react'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='md:container md:mx-auto w-full'>
      <PageHeader/>
        {children}
    </div>
  )
}

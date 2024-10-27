import PageHeader from '@/components/PageHeader'
import React from 'react'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='container mx-auto'>
      <PageHeader/>
        {children}
    </div>
  )
}

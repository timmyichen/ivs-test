import React from 'react'
import dynamic from 'next/dynamic'
const Broadcast = dynamic(() => import('client/Broadcast'), { ssr: false })

const Index: React.FC = () => {
  return (
    <div>
      <Broadcast />
    </div>
  )
}

export default Index

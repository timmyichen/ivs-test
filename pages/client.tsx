import React from 'react'
import dynamic from 'next/dynamic'
const Viewer = dynamic(() => import('client/Viewer'), { ssr: false })

const Index: React.FC = () => {
  return (
    <div>
      <Viewer />
    </div>
  )
}

export default Index

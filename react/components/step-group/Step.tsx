import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

const Step: React.FC = ({ children }) => {
  const { deviceInfo } = useRuntime()

  return (
    <li className="flex">
      <div className={`mb9 ${deviceInfo?.isMobile ? 'w-90' : 'w-100'}`}>
        {children}
      </div>
    </li>
  )
}

export default Step

import React from 'react'

import Styles from './Group.css'

const StepGroup: React.FC = ({ children }) => {
  return (
    <div className="ml5">
      <ol className={Styles.orderedSteps}>{children}</ol>
    </div>
  )
}

export default StepGroup

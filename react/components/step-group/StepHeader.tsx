import React from 'react'
import { Tooltip, IconInfo } from 'vtex.styleguide'

interface StepHeaderProps {
  title: string
  canEditData: boolean
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, canEditData }) => {
  return (
    <>
      <div>
        <span className="t-heading-5 fw6 flex items-center">
          {title}
          {canEditData === false && (
            <div className="dib ml4 mt2">
              <Tooltip label="Log-in to modify">
                <span>
                  <IconInfo />
                </span>
              </Tooltip>
            </div>
          )}
        </span>
      </div>
    </>
  )
}

export default StepHeader

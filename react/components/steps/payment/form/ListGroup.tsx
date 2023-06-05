import React, { useContext, useMemo, createContext } from 'react'

interface ListContext {
  borderPosition: 'top' | 'bottom' | 'none'
}

const ctx = createContext<ListContext | undefined>(undefined)

export const useListContext = () => useContext(ctx)

const ListGroup: React.FC<{ borderPosition?: 'top' | 'bottom' | 'none' }> = ({
  children,
  borderPosition = 'top',
}) => {
  const context = useMemo(
    () => ({
      borderPosition,
    }),
    [borderPosition]
  )

  return (
    <div className="nh5 nh0-ns mt6" role="group">
      <div>
        <ctx.Provider value={context}>{children}</ctx.Provider>
      </div>
    </div>
  )
}

export default ListGroup

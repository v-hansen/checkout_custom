import React, { useEffect } from 'react'
import { Divider, IconPlusLines, IconCaretRight } from 'vtex.styleguide'
import { useListContext } from './ListGroup'
import useDisclosure from '../../../../hooks/useDisclosure'

interface OptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  payment?: any
  selectedId?: any
  selected?: boolean
  caretAlign?: 'start' | 'center' | 'end'
  lean?: boolean
  isLast?: boolean
}

const GroupOption: React.FC<OptionProps> = ({
  onClick = () => { },
  payment,
  selectedId,
  children,
  selected = false,
  isLast = false,
}) => {
  const { onOpen, onClose } = useDisclosure()
  const borderPosition = useListContext()?.borderPosition ?? 'top'

  useEffect(() => {
    if (selectedId === payment.id) {
      onOpen()
    } else {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  return (
    <>
      <button
        className="w-100 tl pointer db lh-copy c-on-base
          bg-base hover-bg-muted-5 ph5 pv5 flex
          items-center justify-between bn"
        onClick={onClick}
        role="option"
        aria-selected={selected}
      >
        {children}
        <span className="c-action-primary inline-flex items-center">
          {payment === 'new' ? <IconPlusLines /> : <IconCaretRight />}
        </span>
      </button>
      {(!isLast || borderPosition === 'top') && (
        <div className="w-100 pr5 pr0-ns">
          <Divider orientation="horizontal" />
        </div>
      )}
    </>
  )
}

export default GroupOption

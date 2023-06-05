import React, { ReactNode } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { IconDelete } from 'vtex.styleguide'

const messages = defineMessages({
  creditCardLabel: {
    defaultMessage: 'Credit Card',
    id: 'checkout-io.credit-card-summary/credit-card-label',
  },
})

interface Props {
  paymentSystem?: string
  lastDigits?: string
  onEdit: () => void
  description?: ReactNode
}

const CardSummary: React.FC<Props> = ({
  lastDigits,
  onEdit,
}) => {
  const intl = useIntl()

  return (
    <div
      className='vw-100 w-auto-ns nl5 nl0-ns bg-muted-5 pa5 flex items-start lh-copy'
      role="option"
      aria-selected
    >
      <div className="flex w-100">
        <div className="flex flex-column">
          <span className="inline-flex items-center f5">
            {lastDigits ? (
              <span className="ml3">
                {intl.formatMessage(messages.creditCardLabel)} ∙∙∙∙ {lastDigits}
              </span>
            ) : (
              <span className="ml3">
                {intl.formatMessage(messages.creditCardLabel)}
              </span>
            )}
          </span>
        </div>
      </div>
      <button
        className="flex-shrink-0 c-muted-1 ml5 pa2 flex items-center bg-transparent bn pointer self-start"
        onClick={onEdit}>
        <IconDelete />
      </button>
    </div>
  )
}

export default CardSummary

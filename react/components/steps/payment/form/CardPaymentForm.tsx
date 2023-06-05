import React, { useState } from 'react'
import { Input } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  completeName: {
    defaultMessage: 'Complete Name',
    id: 'checkout-io.complete-name',
  },
  number: {
    defaultMessage: 'number',
    id: 'checkout-io.number',
  },
  expiresAt: {
    defaultMessage: 'expires at',
    id: 'checkout-io.expires-at',
  },
  securityCode: {
    defaultMessage: 'security code',
    id: 'checkout-io.security-code',
  },
})

interface CreditCardData {
  completeName?: String
  number?: String
  expiresAt?: String
  securityCode?: Number
}

/**
 * @ignore COMPONENT NOT IN USE
 */

const CardPaymentForm: React.FC<any> = () => {
  const intl = useIntl()
  const [state, setState] = useState<CreditCardData>({})

  return (
    <>
      <div>
        <Input
          label={intl.formatMessage(messages.completeName)}
          name="completeName"
          value={state.completeName}
          onChange={(e: any) => {
            setState({
              ...state,
              completeName: e.target.value,
            })
          }}
        />
      </div>
      <div>
        <Input
          label={intl.formatMessage(messages.number)}
          name="number"
          value={state.number}
          onChange={(e: any) => {
            setState({
              ...state,
              number: e.target.value,
            })
          }}
        />
      </div>
      <div>
        <Input
          label={intl.formatMessage(messages.expiresAt)}
          name="expiresAt"
          value={state.expiresAt}
          onChange={(e: any) => {
            setState({
              ...state,
              expiresAt: e.target.value,
            })
          }}
        />
      </div>
      <div>
        <Input
          label={intl.formatMessage(messages.securityCode)}
          name="securityCode"
          value={state.securityCode}
          onChange={(e: any) => {
            setState({
              ...state,
              securityCode: e.target.value,
            })
          }}
        />
      </div>
    </>
  )
}

export default CardPaymentForm

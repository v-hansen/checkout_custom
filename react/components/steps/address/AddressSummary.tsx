import * as React from 'react'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { useHistory } from 'react-router'
import { useIntl, defineMessages } from 'react-intl'

import routes from '../../../utils/routes'
import { useOrder } from '../../../providers/orderform'

const messages = defineMessages({
  address: {
    defaultMessage: 'Address',
    id: 'checkout-io.address',
  },
})

const AddressSummary: React.FC = () => {
  const intl = useIntl()
  const { orderForm } = useOrder()

  const history = useHistory()

  const { street, number, city, state, postalCode } =
    orderForm?.shippingData?.selectedAddresses[0] || {}

  const handleEditAddress = () => {
    history.push(routes.ADDRESS)
  }

  return (
    <div>
      <span className="t-heading-5 fw6 flex items-center">
        {intl.formatMessage(messages.address)}
        <div className="dib ml4">
          <ButtonPlain onClick={handleEditAddress}>
            <IconEdit solid />
          </ButtonPlain>
        </div>
      </span>
      {postalCode && (
        <>
          <div className="flex flex-column flex-row-ns mt4">{postalCode}</div>
        </>
      )}
      {street && (
        <>
          <div className="flex flex-column flex-row-ns mt4">
            {street} {number}
          </div>
          <div className="flex flex-column flex-row-ns">
            <span className="dib mt3">
              {city} {state}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default AddressSummary

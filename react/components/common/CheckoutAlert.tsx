import React from 'react'
import { Alert } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  defaultError: {
    defaultMessage: 'An error has ocurred',
    id: 'checkout-io.default-error',
  },
  close: {
    defaultMessage: 'Close',
    id: 'checkout-io.close',
  },
})

const CheckoutAlert: React.FC<any> = ({
  type = 'error',
  message,
  closeMessage,
  orderError,
  handleCloseAlertError,
}) => {
  const intl = useIntl()

  return (
    <Alert
      type={type}
      onClose={handleCloseAlertError}
      closeIconLabel={closeMessage ?? intl.formatMessage(messages.close)}
    >
      {orderError
        ? JSON.stringify(orderError)
        : message ?? intl.formatMessage(messages.defaultError)}
    </Alert>
  )
}

export default CheckoutAlert

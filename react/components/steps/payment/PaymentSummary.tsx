import * as React from 'react'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { useHistory } from 'react-router'
import { useIntl, defineMessages } from 'react-intl'

import routes from '../../../utils/routes'
import { useOrder } from '../../../providers/orderform'
import { useCheckout } from '../../../providers/checkout'

const messages = defineMessages({
  payment: {
    defaultMessage: 'Payment',
    id: 'checkout-io.payment',
  },
  free: {
    defaultMessage: 'Free',
    id: 'checkout-io.payment-step/free-payment',
  },
})

const PaymentSummary: React.FC = () => {
  const intl = useIntl()
  const {
    orderForm: {
      paymentData: { paymentSystems, payments },
    },
  } = useOrder()

  const { isFreePurchase } = useCheckout()

  const history = useHistory()
  const handleEditPayment = () => {
    history.push(routes.PAYMENT)
  }

  return (
    <div>
      <span className="t-heading-5 fw6 flex items-center">
        {intl.formatMessage(messages.payment)}
        {!isFreePurchase && (
          <div className="dib ml4">
            <ButtonPlain onClick={handleEditPayment}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        )}
      </span>
      {payments.length > 0 && !isFreePurchase && (
        <div className="flex flex-column mt4">
          {paymentSystems
            .filter(
              (method: PaymentSystem) =>
                Number(method.id) === Number(payments[0].paymentSystem)
            )
            .map((payment: any) => (
              <span key={payment?.id} className="ttu">
                {payment.name}
              </span>
            ))}
        </div>
      )}
      {isFreePurchase && (
        <div className="flex flex-column mt4">
          <span className="ttu c-success">
            {intl.formatMessage(messages.free)}
          </span>
        </div>
      )}
    </div>
  )
}

export default PaymentSummary

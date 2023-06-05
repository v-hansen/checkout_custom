import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import { useIntl, defineMessages } from 'react-intl'

import routes from '../../../../utils/routes'
import { useOrder } from '../../../../providers/orderform'
import { PaymentStage } from '../PaymentEnums'
import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import endpoints from '../../../../utils/endpoints'
import GroupOption from './GroupOption'
import ListGroup from './ListGroup'
import CheckoutAlert from '../../../common/CheckoutAlert'
import PaymentFlag from './PaymentFlag'
import CreditCard, { CreditCardRef } from './CreditCard'

const messages = defineMessages({
  payment: {
    defaultMessage: 'Payment',
    id: 'checkout-io.payment',
  },
  requestError: {
    defaultMessage: 'Request failed, try again',
    id: 'checkout-io.request-error',
  },
  free: {
    defaultMessage: 'Free',
    id: 'checkout-io.payment-step/free-payment',
  },
  newCreditCardLabel: {
    defaultMessage: 'New credit card',
    id: 'checkout-io.payment-step/new-credit-card-label',
  }
})

const PaymentForm: React.FC = () => {
  const intl = useIntl()
  const { orderForm, refreshOrder } = useOrder()
  const {
    totalizers,
    paymentData: { paymentSystems, payments },
  } = orderForm

  const [cardType, setCardType] = useState<CardType>('new')
  const [cardFormFilled, setCardFormFilled] = useState(false)
  const creditCardRef = useRef<CreditCardRef>(null)

  const history = useHistory()
  const [showAlertError, setShowAlertError] = useState(false)

  const value =
    payments?.reduce(
      (total: number, payment: Payment) => total + (payment?.value ?? 0),
      0
    ) ?? 0

  const referenceValue =
    totalizers?.reduce((total: number, totalizer: Totalizer) => {
      if (totalizer?.id === 'Tax' || totalizer?.id === 'interest') {
        return total
      }

      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return total + (totalizer?.value ?? 0)
    }, 0) ?? 0

  const isFreePurchase = !referenceValue && orderForm.items.length > 0

  const [stage, setStage] = useState<PaymentStage>(
    isFreePurchase ? PaymentStage.FREE_PURCHASE : PaymentStage.PAYMENT_LIST
  )

  const [paymentSelected /* , setPaymentSelected */] = useState<any>(null)

  const [
    updatePaymentResponse,
    isFetchingUpdatePayment,
    setRequestUpdatePayment,
  ] = useFetch({} as RequestInfo)

  const [
    simulationResponse,
    isFetchingSimulation,
    setRequestSimulation,
  ] = useFetch({} as RequestInfo)

  const runSimulation = () => {
    setRequestSimulation({
      Method: 'POST',
      EndPoint: `${endpoints.SIMULATION}`,
      RequestBody: {
        orderFormId: orderForm?.orderFormId,
        countryCode: orderForm?.storePreferencesData?.countryCode,
        postalCode: orderForm?.shippingData?.selectedAddresses[0]?.postalCode
      },
    })
  }

  useEffect(() => {
    if (
      !isFetchingSimulation&&
      simulationResponse?.Data?.orderForm
      ) {
      refreshOrder().then(() => {
        history.push(routes.INDEX)
      })
    } else if (!isFetchingSimulation && simulationResponse?.hasError) {
      setShowAlertError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingSimulation, simulationResponse])

  useEffect(() => {
    if (
      !isFetchingUpdatePayment &&
      updatePaymentResponse?.Data?.orderForm?.orderFormId
    ) {
      runSimulation()
    } else if (!isFetchingUpdatePayment && updatePaymentResponse?.hasError) {
      setShowAlertError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUpdatePayment, updatePaymentResponse])

  const handlePaymentSelect = async (payment: PaymentSystem) => {
    const _payments = [
      {
        paymentSystem: payment.id,
        paymentSystemName: payment.name,
        group: payment.groupName,
        installments: 1,
        installmentsInterestRate: 0,
        value,
        referenceValue,
      },
    ]

    setRequestUpdatePayment({
      Method: 'POST',
      EndPoint: `${endpoints.PAYMENT}`,
      RequestBody: {
        orderFormId: orderForm?.orderFormId,
        payments: _payments,
      }
    })
  }

  const handleCloseAlertError = () => {
    setShowAlertError(false)
  }

  const handleDeselectPayment = () => {
    creditCardRef?.current?.resetCardFormData()

    setCardFormFilled(false)
    setStage(PaymentStage.CARD_FORM)
  }

  const handleNewCreditCard = () => {
    setCardType('new')
    handleDeselectPayment()
  }

  const handleCardFormCompleted = () => {
    setCardFormFilled(true)
    console.log('## cardFormFilled', cardFormFilled)
    if (cardType === 'new') {
      console.log('## open installments (?)')
    } else {
      console.log('## history.push(routes.REVIEW) (?)')
      history.push(routes.INDEX)
      /* history.push(routes.REVIEW) */
    }
  }

  const handleChangePaymentMethod = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  return (
    <>
      <div>
        <span className="t-heading-5 fw6 flex items-center">
          {intl.formatMessage(messages.payment)}
        </span>
      </div>
      <div
        className={`${stage === PaymentStage.CARD_FORM ? '' : 'dn'}`}
      >
        <CreditCard
          ref={creditCardRef}
          onCardFormCompleted={handleCardFormCompleted}
          onChangePaymentMethod={handleChangePaymentMethod}
          onSetCardType={setCardType}
          cardType={cardType}
          key={cardType}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <>
          <ListGroup>
            <GroupOption
              onClick={handleNewCreditCard}
              selectedId={paymentSelected}
              caretAlign="center"
              key="new"
              payment="new"
            >
              <div
                className="flex items-center c-muted-1"
                data-testid="new">
                <span>{intl.formatMessage(messages.newCreditCardLabel)}</span>
              </div>
            </GroupOption>
            {paymentSystems.map((paymentSystem: any) => (
              <GroupOption
                caretAlign="center"
                key={paymentSystem.id}
                payment={paymentSystem}
                selectedId={paymentSelected}
                onClick={() => handlePaymentSelect(paymentSystem)}
              >
                <div
                  className="flex items-center c-muted-1"
                  data-testid={paymentSystem.id}
                >
                  <div className="h2 mr4">
                    <PaymentFlag paymentSystemGroup={paymentSystem.groupName} />
                  </div>
                  <span>{paymentSystem.name}</span>
                </div>
              </GroupOption>
            ))}
          </ListGroup>
        </>
      ) : (
        <div className="flex flex-column mt4">
          <span className="ttu c-on-success">
            {intl.formatMessage(messages.free)}
          </span>
        </div>
      )}
      {showAlertError && (
        <div className="mt5">
          <CheckoutAlert
            message={intl.formatMessage(messages.requestError)}
            handleCloseAlertError={handleCloseAlertError}
          />
        </div>
      )}
    </>
  )
}

export default PaymentForm

import React, { useEffect, useState } from 'react'
import { ButtonWithIcon, IconShoppingCart, IconFailure } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useOrder } from '../../providers/orderform'
import { useCheckout } from '../../providers/checkout'
import CheckoutAlert from '../common/CheckoutAlert'

const shoppingCart = <IconShoppingCart />
const failureIcon = <IconFailure />

/**
 * @returns a button that places an order with the current orderform
 * @description this will first create the `transaction` and later
 * will fetch the `payment` API to finalize the order
 */

const PlaceOrder: React.FC = () => {
  const [canPlaceOrder, setCanPlaceOrder] = useState<boolean | null>(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { orderForm, orderLoading } = useOrder()
  const { orderFormId, paymentData, shippingData } = orderForm as OrderForm

  const {
    exhaustedDeliveries,
    referenceValue,
    paymentValue,
    interestValue,
  } = useCheckout()

  const intl = useIntl()
  const {
    culture: { currency },
    rootPath = '',
  } = useRuntime()

  /* Validations used to allow placing the order */
  const isAddressValid = shippingData.selectedAddresses.length > 0
  const isPaymentValid = paymentData?.payments?.length > 0
  const isDeliveryValid = !exhaustedDeliveries

  useEffect(() => {
    if (isAddressValid && isPaymentValid && isDeliveryValid) {
      setCanPlaceOrder(true)
    } else {
      setCanPlaceOrder(false)
    }
  }, [isAddressValid, isDeliveryValid, isPaymentValid])

  const handlePlaceOrder = async () => {
    const transactionData = {
      referenceId: orderFormId,
      referenceValue,
      value: paymentValue,
      interestValue,
      savePersonalData: true,
      optinNewsLetter: false,
    }

    setPlacingOrder(true)
    setErrorMessage(null)

    /* Creates the transaction using the documented Checkout API */
    const startTransactionResponse = await fetch(
      `${rootPath}/api/checkout/pub/orderForm/${orderFormId}/transaction`,
      {
        method: 'post',
        body: JSON.stringify(transactionData),
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    if (!startTransactionResponse.ok) {
      setPlacingOrder(false)

      return
    }

    const transaction = await startTransactionResponse.json()

    const {
      orderGroup: orderGroupId,
      id: transactionId,
      receiverUri,
      merchantTransactions,
      paymentData: { payments: transactionPayments },
      gatewayCallbackTemplatePath,
    } = transaction

    if (transactionId === 'NO-PAYMENT') {
      window.location.replace(receiverUri)

      return
    }

    if (merchantTransactions?.length > 0) {
      /* This calculates the payments needed per payment flag */
      const allPayments = transactionPayments.reduce(
        (_payments: any, transactionPayment: any) => {
          const merchantPayments = transactionPayment.merchantSellerPayments
            .map((merchantPayment: any) => {
              const merchantTransaction = merchantTransactions.find(
                (merchant: any) => merchant.id === merchantPayment.id
              )

              if (!merchantTransaction) {
                return null
              }

              const { merchantSellerPayments, ...payment } = transactionPayment

              return {
                ...payment,
                ...merchantPayment,
                currencyCode: currency as string,
                installmentsValue: merchantPayment.installmentValue,
                installmentsInterestRate: merchantPayment.interestRate,
                transaction: {
                  id: merchantTransaction.transactionId,
                  merchantName: merchantTransaction.merchantName,
                },
              }
            })
            .filter((merchantPayment: any) => merchantPayment != null)

          return _payments.concat(merchantPayments)
        },
        []
      )

      const callbackUrl = `${
        rootPath || window.location.origin
      }${gatewayCallbackTemplatePath}`

      let redirectUrl

      /* We inform the payments API all the outstanding payments */
      const paymentsResponse = await fetch(
        `${rootPath}/api/payments/pub/transactions/${transactionId}/payments?orderId=${orderGroupId}&redirect=false&callbackUrl=${callbackUrl}`,
        {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(allPayments),
        }
      )

      if (paymentsResponse.status === 201) {
        redirectUrl = gatewayCallbackTemplatePath.replace(
          '{messageCode}',
          'Success'
        )
      } else {
        setPlacingOrder(false)
        setErrorMessage(intl.formatMessage(messages.defaultError))

        return
      }

      const callbackResponse = await fetch(
        `${rootPath}/api/checkout/pub/gatewayCallback/${orderGroupId}`,
        { method: 'POST' }
      )

      if (callbackResponse.ok) {
        window.location.replace(redirectUrl)
      } else if (callbackResponse.status === 428) {
        /**
         * @summary
         * Status code 428 means that the payment is a redirect or a connector app
         * that should be rendered to fulfill it
         * @warn
         * THIS APPROACH DOES NOT SUPPORT SPLIT-PAYMENT
         */
        const connectorData = await callbackResponse.json()
        const redirectType = connectorData.RedirectResponseCollection
        const renderAuthType = connectorData.paymentAuthorizationAppCollection

        if (redirectType.length) {
          // REDIRECTS TO PAYMENT PROVIDER
          window.location.replace(redirectType[0].redirectUrl)
        } else if (renderAuthType.length) {
          /**
           * Here the connector responds with the app name that should be rendered.
           * You should pass the appPayload to your preferred auth app.
           * @example
           * <SequraAuthApp payload={connectorData.paymentAuthorizationAppCollection[0].appPayload}
           */
          setPlacingOrder(false)
          setErrorMessage(intl.formatMessage(messages.defaultError))
        } else {
          setPlacingOrder(false)
          setErrorMessage(intl.formatMessage(messages.defaultError))
        }
      }
    } else if (!receiverUri) {
      setPlacingOrder(false)
      setErrorMessage(intl.formatMessage(messages.defaultError))
    } else if (transactionId === 'NO-PAYMENT') {
      window.location.href = receiverUri
    }
  }

  return (
    <div>
      {errorMessage && (
        <div className="mb6 mb7-ns mt5">
          <CheckoutAlert
            message={errorMessage}
            closeMessage={intl.formatMessage(messages.close)}
            handleCloseAlertError={() => setErrorMessage(null)}
          />
        </div>
      )}
      <ButtonWithIcon
        icon={canPlaceOrder ? shoppingCart : failureIcon}
        block
        isLoading={placingOrder || orderLoading}
        onClick={canPlaceOrder && handlePlaceOrder}
      >
        {canPlaceOrder
          ? intl.formatMessage(messages.placeOrder)
          : intl.formatMessage(messages.completeAllSteps)}
      </ButtonWithIcon>
    </div>
  )
}

const messages = defineMessages({
  defaultError: {
    defaultMessage: 'An error has ocurred',
    id: 'checkout-io.default-error',
  },
  close: {
    defaultMessage: 'Close',
    id: 'checkout-io.close',
  },
  placeOrder: {
    defaultMessage: 'Place order',
    id: 'checkout-io.place-order',
  },
  completeAllSteps: {
    defaultMessage: 'Complete all steps',
    id: 'checkout-io.complete-all-steps',
  },
})

export default PlaceOrder

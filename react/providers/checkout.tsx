import React, { createContext, useContext, useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { useOrder } from './orderform'

interface Context {
  exhaustedDeliveries: boolean
  referenceValue: number
  paymentValue: number
  interestValue: number
  isFreePurchase: boolean
}

const CheckoutContext = createContext<Context>({} as Context)

export const CheckoutContextProvider: React.FC = ({ children }) => {
  const { orderForm } = useOrder()
  const { production } = useRuntime()

  const postalCode =
    orderForm?.shippingData?.selectedAddresses[0]?.postalCode ?? ''

  const getCheckoutDeliveries = () => {
    const exhaustedDeliveries =
      orderForm?.shippingData?.logisticsInfo.every(
        (item: LogisticsInfo) => item.slas.length === 0
      ) ?? false

    return { exhaustedDeliveries }
  }

  const getCheckoutValues = () => {
    const referenceValue =
      orderForm?.totalizers?.reduce(
        (total: number, totalizer: { id: string; value: number }) => {
          if (totalizer?.id === 'Tax' || totalizer?.id === 'interest') {
            return total
          }

          return total + (totalizer?.value ?? 0)
        },
        0
      ) ?? 0

    const paymentValue =
      orderForm?.paymentData.payments?.reduce(
        (total: number, payment: { value: number }) =>
          total + (payment?.value ?? 0),
        0
      ) ?? 0

    const interestValue =
      orderForm?.paymentData.payments?.reduce(
        (total: number, payment: { value: number; referenceValue: number }) =>
          total + ((payment?.value ?? 0) - (payment?.referenceValue ?? 0)),
        0
      ) ?? 0

    const isFreePurchase = !referenceValue && orderForm?.items.length > 0

    if (!production) {
      console.log(
        '%c referenceValue ',
        'background: #fff; color: #333',
        referenceValue
      )
      console.log(
        '%c paymentValue ',
        'background: #fff; color: #333',
        paymentValue
      )
      console.log(
        '%c interestValue ',
        'background: #fff; color: #333',
        interestValue
      )
    }

    return {
      referenceValue,
      paymentValue,
      interestValue,
      isFreePurchase,
    }
  }

  const deliveries = useMemo(
    () => getCheckoutDeliveries(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postalCode]
  )

  const values = useMemo(
    () => getCheckoutValues(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderForm]
  )

  const context = { ...values, ...deliveries }

  return (
    <CheckoutContext.Provider value={context}>
      {children}
    </CheckoutContext.Provider>
  )
}

/**
 * Use this hook to access data that you only want to
 * calculate once per render
 * @returns exhaustedDeliveries, referenceValue, paymentValue, interestValue, isFreePurchase
 */
export const useCheckout = () => {
  const context = useContext(CheckoutContext)

  if (context === undefined) {
    throw new Error(
      'useCheckout must be used within an CheckoutContextProvider'
    )
  }

  return context
}

export default { CheckoutContextProvider, useCheckout }

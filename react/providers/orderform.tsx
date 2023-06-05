import React, { createContext, useContext, useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { OperationVariables } from 'apollo-client'

import GET_ORDER from '../graphql/orderform.gql'

interface Context {
  orderForm: OrderForm
  orderError: boolean
  orderLoading: boolean
  refreshOrder: (variables?: OperationVariables | undefined) => Promise<any>
}

const OrderContext = createContext<Context>({} as Context)

export const OrderContextProvider: React.FC = ({ children }) => {
  const {
    data,
    error,
    loading: orderLoading,
    refetch: refreshOrder,
  } = useQuery(GET_ORDER, {
    fetchPolicy: 'no-cache',
  })

  const orderForm = data?.checkoutOrder as OrderForm
  const orderError = Boolean(error)

  console.log('%c ORDERFORM ', 'background: green; color: white', orderForm)
  console.log(
    '%c Loading? / Error? ',
    'background: white; color: black',
    orderLoading,
    orderError
  )

  const context = useMemo(
    () => ({
      orderForm,
      orderError,
      orderLoading,
      refreshOrder,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderForm, orderError, orderLoading, refreshOrder]
  )

  return (
    <OrderContext.Provider value={context}>{children}</OrderContext.Provider>
  )
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useOrder = () => {
  const context = useContext(OrderContext)

  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderContextProvider')
  }

  return context
}

export default { OrderContextProvider, useOrder }

/* eslint-disable no-console */
import React, { useEffect } from 'react'
import { NoSSR, useRuntime } from 'vtex.render-runtime'
import { HashRouter } from 'react-router-dom'
import { Progress } from 'vtex.styleguide'

import { OrderContextProvider, useOrder } from './providers/orderform'
import { CheckoutContextProvider } from './providers/checkout'

interface CheckoutContainer {
  enforceLogin?: boolean
}

const Checkout: React.FC<CheckoutContainer> = ({
  children,
  enforceLogin = false,
}) => {
  const { orderForm, orderLoading } = useOrder()
  const { navigate, page } = useRuntime()

  const hasItems = orderForm?.items?.length > 0

  const shouldGoToIdentification =
    !orderForm?.clientProfileData?.email &&
    page !== 'store.checkout.identification'

  const shouldGoToLogin = enforceLogin && !orderForm?.loggedIn

  useEffect(() => {
    if (orderLoading) {
      return
    }

    if (!hasItems) {
      navigate({ page: 'store.checkout.cart' })

      return
    }

    if (shouldGoToLogin) {
      navigate({
        page: 'store.login',
        query: `returnUrl=checkout`,
      })

      return
    }

    if (shouldGoToIdentification) {
      navigate({ page: 'store.checkout.identification' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldGoToLogin, hasItems, orderLoading, shouldGoToIdentification])

  if (shouldGoToIdentification || shouldGoToLogin)
    return <Progress type="steps" steps={['inProgress']} />

  return <>{children}</>
}

const Container: React.FC<CheckoutContainer> = ({ children, enforceLogin }) => {
  return (
    <NoSSR>
      <HashRouter>
        <OrderContextProvider>
          <CheckoutContextProvider>
            <Checkout enforceLogin={enforceLogin}>{children}</Checkout>
          </CheckoutContextProvider>
        </OrderContextProvider>
      </HashRouter>
    </NoSSR>
  )
}

export default Container

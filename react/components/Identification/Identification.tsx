import classNames from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import {
  IconCheck,
  IconArrowBack,
  Input,
  Button,
  Divider,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl, defineMessages } from 'react-intl'

import styles from './Identification.css'
import useFetch, { RequestInfo } from '../../hooks/useFetch'
import endpoints from '../../utils/endpoints'
import { useOrder } from '../../providers/orderform'

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

const messages = defineMessages({
  backToCart: {
    defaultMessage: 'Back to Cart',
    id: 'checkout-io.back-to-cart',
  },
  continueToCheckout: {
    defaultMessage: 'Continue to Checkout',
    id: 'checkout-io.continue-to-checkout',
  },
  invalidEmailPleaseTryAgain: {
    defaultMessage: 'Invalid Email, please try again',
    id: 'checkout-io.invalid-email-please-try-again',
  },
  email: {
    defaultMessage: 'Email',
    id: 'checkout-io.email',
  },
  useSavedAddressesAndCards: {
    defaultMessage: 'Use saved addresses and cards',
    id: 'checkout-io.use-saved-addresses-and-cards',
  },
  applyYourSavedGiftCards: {
    defaultMessage: 'Apply your saved gift cards',
    id: 'checkout-io.apply-your-saved-gift-cards',
  },
  receiveUpdatesAboutYourOrder: {
    defaultMessage: 'Receive updates about your order',
    id: 'checkout-io.receive-updates-about-your-order',
  },
  youBeAbleTo: {
    defaultMessage: "You'll be able to",
    id: 'checkout-io.you-be-able-to',
  },
})

const Identification: React.FC = () => {
  const intl = useIntl()
  const { orderForm, orderLoading, refreshOrder } = useOrder()

  const [clientData, isFetchingClient, setOrderClient] = useFetch(
    {} as RequestInfo
  )

  const [profileData, isFetchingProfile, setGetProfile] = useFetch(
    {} as RequestInfo
  )

  const [email, setEmail] = useState('')
  const emailRef = useRef(email)
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { navigate } = useRuntime()

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setEmail(evt.target.value)
  }

  useEffect(() => {
    emailRef.current = email
  }, [email])

  const emailValid = EMAIL_REGEX.test(email)

  const handleBackToStoreClick = () => {
    navigate({ page: 'store.checkout.cart' })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault()

    if (!email || !emailValid) {
      return
    }

    if (email === orderForm?.clientProfileData?.email) {
      setShowError(true)

      return
    }

    setLoading(true)
    setGetProfile({
      Method: 'GET',
      EndPoint: `${endpoints.PROFILE}?email=${email}`,
    })
  }

  const handleEmailBlur = () => {
    setShowError(!emailValid)
  }

  useEffect(() => {
    if (!profileData?.Data || isFetchingProfile) {
      return
    }

    const userProfile = profileData?.Data?.profile?.userProfile

    setOrderClient({
      Method: 'POST',
      EndPoint: `${endpoints.PROFILE}`,
      RequestBody: {
        orderFormId: orderForm?.orderFormId,
        fields: userProfile ? { ...userProfile } : { email },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingProfile, profileData, setOrderClient])

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (!isFetchingClient && clientData && clientData.Data && refreshOrder) {
      refreshOrder().then(() => {
        navigate({
          page: 'store.checkout.order-form',
        })
      })
    }
  }, [clientData, isFetchingClient, navigate, refreshOrder])

  if (orderLoading) return null

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={classNames(styles.box, 'ba-ns br3 b--muted-4 pa4 pa8-ns')}
    >
      <div className={classNames(styles.buttonContainer, 'mb7')}>
        <Button
          size="small"
          variation="tertiary"
          noUpperCase
          neutral
          onClick={handleBackToStoreClick}
        >
          <span className="mr3">
            <IconArrowBack />
          </span>
          <span className="ml1">{intl.formatMessage(messages.backToCart)}</span>
        </Button>
      </div>

      <span className="f4 dib mt7 mb5">
        {intl.formatMessage(messages.email)}
      </span>

      <Input
        autoComplete="email"
        type="email"
        value={email}
        onBlur={handleEmailBlur}
        onChange={handleEmailChange}
        errorMessage={
          showError && intl.formatMessage(messages.invalidEmailPleaseTryAgain)
        }
      />

      <div className="flex mt5">
        <Button block isLoading={loading} type="submit">
          {intl.formatMessage(messages.continueToCheckout)}
        </Button>
      </div>

      <div className="mv7">
        <Divider />
      </div>

      <div>
        <span className="c-muted-1 f5 b">
          {intl.formatMessage(messages.youBeAbleTo)}
        </span>
        <ol className="list ma0 pa0 f5 c-muted-1">
          <li className="mt3">
            <IconCheck />
            {intl.formatMessage(messages.useSavedAddressesAndCards)}
          </li>
          <li className="mt2">
            <IconCheck />
            {intl.formatMessage(messages.applyYourSavedGiftCards)}
          </li>
          <li className="mt2">
            <IconCheck />
            {intl.formatMessage(messages.receiveUpdatesAboutYourOrder)}
          </li>
        </ol>
      </div>
    </form>
  )
}

export default Identification

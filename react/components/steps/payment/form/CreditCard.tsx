import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useOrder } from '../../../../providers/orderform'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import CardSummary from './CardSummary'
import endpoints from '../../../../utils/endpoints'
import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import styles from '../PaymentStyles.css'

const messages = defineMessages({
  selectedPaymentLabel: {
    defaultMessage: 'You selected',
    id: 'checkout-io.credit-card/selected-payment-label'
  },
  reviewPurchaseLabel: {
    defaultMessage: 'Review purchase',
    id: 'checkout-io.credit-card/review-purchase-label'
  },
  cardFormTitle: {
    defaultMessage: 'Container for credit card form',
    id: 'checkout-io.credit-card/card-form-title',
  },
  save: {
    defaultMessage: 'Save',
    id: 'checkout-io.save',
  },
})

let postRobot: typeof import('post-robot') | null = null
let iFrameResize: typeof import('iframe-resizer') | null = null

if (window?.document) {
  postRobot = require('post-robot')
  iFrameResize = require('iframe-resizer').iframeResize
}

const IFRAME_APP_VERSION = '0.9.1'
const PORT = 3000

const iframeURLProd = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`
const iframeURLDev = `https://checkoutio.vtexlocal.com.br:${PORT}/`

const { production, query } = __RUNTIME__
const LOCAL_IFRAME_DEVELOPMENT = !production && query?.__localCardUi !== undefined
const iframeURL = LOCAL_IFRAME_DEVELOPMENT ? iframeURLDev : iframeURLProd

interface Props {
  onCardFormCompleted: () => void
  onChangePaymentMethod: () => void
  onSetCardType: (value: any) => void
  cardType: CardType
}

export interface CreditCardRef {
  resetCardFormData: () => void
  updateAddress: (address: string | Address) => void
  updateDocument: (document: string) => void
}

const CreditCard = forwardRef<CreditCardRef, Props>(function CreditCard(
  {
    onCardFormCompleted,
    onChangePaymentMethod,
    onSetCardType,
    cardType,
  },
  ref
) {
  const [iframeLoading, setIframeLoading] = useState(true)

  const {
    orderForm: {
      totalizers,
      paymentData: { paymentSystems, payments },
    },
  } = useOrder()

  const { orderForm, refreshOrder } = useOrder()

  const [
    updatePaymentResponse,
    isFetchingUpdatePayment,
    setRequestUpdatePayment,
  ] = useFetch({} as RequestInfo)

  useEffect(() => {
    if (
      !isFetchingUpdatePayment &&
      updatePaymentResponse?.Data?.orderForm?.orderFormId
    ) {
      refreshOrder().then(() => {
        // history.push(routes.INDEX)
        console.log('## orderForm actualizado', orderForm)
        onSetCardType('saved');
      })
    } else if (!isFetchingUpdatePayment && updatePaymentResponse?.hasError) {
      // setShowAlertError(true)
      console.log('## error - updatePaymentResponse', updatePaymentResponse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUpdatePayment, updatePaymentResponse])

  const payment = payments?.[0] ?? {}

  const setOrderPayment = useCallback(
    async (paymentData: PaymentDataInput) => {
      setRequestUpdatePayment({
        Method: 'POST',
        EndPoint: `${endpoints.PAYMENT}`,
        RequestBody: {
          orderFormId: orderForm?.orderFormId,
          payments: paymentData.payments,
        },
      })
    }, []
  )

  const setPaymentField = useCallback(
    (paymentField: Partial<PaymentInput>) => {
      const newPayment = {
        ...payment,
        ...paymentField,
      }
      return setOrderPayment({
        payments: [newPayment],
      })
    },
    [payment, setOrderPayment]
  )

  const referenceValue =
    totalizers?.reduce((total: number, totalizer: Totalizer) => {
      if (totalizer?.id === 'Tax' || totalizer?.id === 'interest') {
        return total
      }
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return total + (totalizer?.value ?? 0)
    }, 0) ?? 0

  const [cardLastDigits, setCardLastDigits] = useState('')
  const [
    selectedPaymentSystem,
    setSelectedPaymentSystem,
  ] = useState<PaymentSystem | null>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const {
    culture: { locale },
  } = useRuntime()
  const isSSR = useSSR()
  const intl = useIntl()

  const creditCardPaymentSystems = useMemo(
    () =>
      paymentSystems.filter(
        (paymentSystem: PaymentSystem) =>
          paymentSystem.groupName === 'creditCardPaymentGroup'
      ),
    [paymentSystems]
  )

  const setupIframe = useCallback(async () => {
    iFrameResize?.(
      {
        heightCalculationMethod: 'documentElementOffset',
        checkOrigin: false,
        resizeFrom: 'parent',
        autoResize: true,
      },
      iframeRef.current!
    )

    const stylesheetsUrls = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')
    ).map(link => link.href)

    await postRobot.send(iframeRef.current!.contentWindow, 'setup', {
      stylesheetsUrls,
      paymentSystems: creditCardPaymentSystems,
    })
    setIframeLoading(false)
  }, [creditCardPaymentSystems])

  const showCardErrors = useCallback(async () => {
    await postRobot.send(iframeRef.current!.contentWindow, 'showCardErrors')
  }, [])

  const resetCardFormData = useCallback(async () => {
    if (iframeRef.current) {
      await postRobot.send(iframeRef.current.contentWindow, 'resetCardFormData')
    }
  }, [])

  const updateAddress = (address: string | Address) => {
    if (!iframeRef.current) {
      return
    }

    postRobot.send(iframeRef.current.contentWindow, 'updateAddress', {
      address,
    })
  }

  const updateDocument = (doc: string) => {
    if (!iframeRef.current) {
      return
    }

    postRobot.send(iframeRef.current.contentWindow, 'updateDocument', {
      document: doc,
    })
  }

  useImperativeHandle(ref, () => ({
    resetCardFormData,
    updateAddress,
    updateDocument,
  }))

  useEffect(function createPaymentSystemListener() {
    const listener = postRobot.on(
      'paymentSystem',
      ({ data }: { data: PaymentSystem }) => {
        setSelectedPaymentSystem(data)
      }
    )
    return () => listener.cancel()
  }, [])

  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async () => {
    setSubmitLoading(true)

    try {
      const { data: cardIsValid } = await postRobot.send(
        iframeRef.current!.contentWindow,
        'isCardValid'
      )

      if (!selectedPaymentSystem || !cardIsValid) {
        showCardErrors()
        return
      }

      if (cardType === 'new') {
        const { data: lastDigits } = await postRobot.send(
          iframeRef.current!.contentWindow,
          'getCardLastDigits'
        )

        setCardLastDigits(lastDigits)

        console.log('## selectedPaymentSystem', selectedPaymentSystem)

        await setPaymentField({
          paymentSystem: selectedPaymentSystem.id,
          paymentSystemName: selectedPaymentSystem.name,
          group: selectedPaymentSystem.groupName,
          installments: 1,
          installmentsInterestRate: 0,
          referenceValue,
        })
      }

      onCardFormCompleted()
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCardSummaryClick = async () => {
    resetCardFormData()
    onChangePaymentMethod()
  }

  if (isSSR) {
    return null
  }

  return (
    <div className="relative w-100">
      <span className="dib t-heading-6 mb5">
        {intl.formatMessage(messages.selectedPaymentLabel)}
      </span>
      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className={cardType === 'saved' ? 'mb5' : 'mb3'}>
        <CardSummary
          paymentSystem={
            cardType === 'saved' ? payment.paymentSystem! : undefined
          }
          lastDigits={cardType === 'saved' ? cardLastDigits : undefined}
          onEdit={handleCardSummaryClick}
        />
      </div>

      <iframe
        id="chk-card-form"
        /* className={classNames(styles.iframe, 'vw-100 w-auto-ns nl5 nh0-ns', {
          [styles.newCard]: cardType === 'new',
          [styles.savedCard]: cardType === 'saved',
        })} */
        className={`${styles.creditCardIframe} vw-100 w-auto-ns nl5 nh0-ns`}
        title={intl.formatMessage(messages.cardFormTitle)}
        // The scrolling attribute is set to 'no' in the iframe tag, as older versions of IE don't allow
        // this to be turned off in code and can just slightly add a bit of extra space to the bottom
        // of the content that it doesn't report when it returns the height.
        scrolling="no"
        frameBorder="0"
        src={`${iframeURL}?locale=${locale}&cardType=${cardType}`}
        onLoad={() => setupIframe()}
        ref={iframeRef}
      />

      <div className="flex mt5">
        <Button
          size="large"
          block
          onClick={handleSubmit}
          isLoading={submitLoading}
        >
          <span className="f5">
            {intl.formatMessage(cardType === 'saved' ? messages.reviewPurchaseLabel : messages.save)}
          </span>
        </Button>
      </div>
    </div>
  )
})

export default CreditCard

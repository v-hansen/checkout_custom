import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Button } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import { useCheckout } from '../../../../providers/checkout'
import { useOrder } from '../../../../providers/orderform'
import endpoints from '../../../../utils/endpoints'
import routes from '../../../../utils/routes'
import CheckoutAlert from '../../../common/CheckoutAlert'
import ShippingOption from './ShippingOption'

const messages = defineMessages({
  delivery: {
    defaultMessage: 'Delivery',
    id: 'checkout-io.delivery',
  },
  save: {
    defaultMessage: 'Save',
    id: 'checkout-io.save',
  },
})

const reduceLogisticsInfo = (prevState: any, sla: any) => {
  const newArray = [...prevState]

  return newArray.map((obj) => (obj.itemIndex === sla.itemIndex ? sla : obj))
}

const createInitialPayload = (shippingData: ShippingData) => {
  return shippingData.logisticsInfo.map((item: LogisticsInfo) => {
    return {
      itemIndex: item.itemIndex,
      selectedSla: item.selectedSla,
      selectedDeliveryChannel: 'delivery',
    }
  })
}

const DeliveryForm: React.FC = () => {
  const intl = useIntl()
  const [showAlertError, setShowAlertError] = useState(false)
  const { orderForm, orderLoading, refreshOrder } = useOrder()
  const { items, shippingData } = orderForm
  const history = useHistory()

  const { exhaustedDeliveries } = useCheckout()

  const [logisticsPayload, setLogisticsPayload] = useState(
    createInitialPayload(shippingData)
  )

  const [
    updateDeliveryResponse,
    isFetchingUpdateDelivery,
    setRequestUpdateDelivery,
  ] = useFetch({} as RequestInfo)

  const handleRadioChange = (
    itemId: number,
    deliveryId: string,
    scheduleWindow?: DeliveryWindow
  ) => {
    const selectedOption = {
      itemIndex: itemId,
      selectedSla: deliveryId,
      selectedDeliveryChannel: 'delivery',
      ...(scheduleWindow
        ? {
            deliveryWindow: {
              ...scheduleWindow,
            },
          }
        : ''),
    }

    setLogisticsPayload((prevState: any) => {
      /* console.log('%c prevState ', 'background: red; color: #333', prevState)

      console.log(
        '%c selectedOption ',
        'background: orange; color: #333',
        selectedOption
      ) */

      return reduceLogisticsInfo(prevState, selectedOption)
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()

    setRequestUpdateDelivery({
      Headers: {
        Cookie: `checkout.vtex.com=__ofid=${orderForm?.orderFormId};`,
      },
      Method: 'POST',
      EndPoint: `${endpoints.SHIPPING}`,
      RequestBody: {
        orderFormId: orderForm?.orderFormId,
        shipping: {
          selectedAddresses: [{ ...shippingData.selectedAddresses[0] }],
          logisticsInfo: logisticsPayload,
        },
      },
    })
  }

  useEffect(() => {
    if (isFetchingUpdateDelivery) {
      return
    }

    if (updateDeliveryResponse?.Data?.orderForm?.orderFormId) {
      refreshOrder().then(() => {
        history.push(routes.INDEX)
      })
    } else if (updateDeliveryResponse.hasError) {
      setShowAlertError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDeliveryResponse, isFetchingUpdateDelivery])

  const getDeliveryOptionsByIndex = (index: number) => {
    return shippingData.logisticsInfo.filter(
      (info: LogisticsInfo) => info?.itemIndex === index
    )[0]
  }

  return (
    <>
      <div>
        <span className="t-heading-5 fw6 flex items-center">
          {intl.formatMessage(messages.delivery)}
        </span>
      </div>
      <form className="mt6" onSubmit={handleSubmit}>
        {items.map((item: Item, index: number) => {
          return (
            <ShippingOption
              key={index}
              index={index}
              item={item}
              deliveryOptions={getDeliveryOptionsByIndex(index)}
              onSelectOption={handleRadioChange}
              selectedValue={logisticsPayload[index].selectedSla}
            />
          )
        })}
        {!exhaustedDeliveries && (
          <div className="mt8" data-testid="delivery-continue-wrapper">
            <Button /* disabled={!validForm} */
              size="large"
              type="submit"
              isLoading={isFetchingUpdateDelivery || orderLoading}
              block
            >
              <span className="f5">{intl.formatMessage(messages.save)}</span>
            </Button>
          </div>
        )}

        {showAlertError && (
          <div className="mt5">
            <CheckoutAlert
              message={`Error: ${updateDeliveryResponse?.Data}`}
              handleCloseAlertError={() => {
                setShowAlertError(false)
              }}
            />
          </div>
        )}
      </form>
    </>
  )
}

export default DeliveryForm

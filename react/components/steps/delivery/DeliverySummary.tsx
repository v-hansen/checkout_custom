import * as React from 'react'
import { ButtonPlain, IconEdit, Tooltip, IconInfo } from 'vtex.styleguide'
import { useHistory } from 'react-router'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { useIntl, defineMessages } from 'react-intl'

import routes from '../../../utils/routes'
import { useOrder } from '../../../providers/orderform'
import { useCheckout } from '../../../providers/checkout'
import CheckoutAlert from '../../common/CheckoutAlert'

const messages = defineMessages({
  delivery: {
    defaultMessage: 'Delivery',
    id: 'checkout-io.delivery',
  },
  noDeliveryWindowSelected: {
    defaultMessage: 'NO DELIVERY WINDOW SELECTED',
    id: 'checkout-io.no-delivery-window-selected',
  },
  shippingUnavailable: {
    defaultMessage: 'No shipping method available',
    id: 'checkout-io.shipping-unavailable',
  },
  shippingUnavailableBasket: {
    defaultMessage: "Your items can't be delivered to your Postal Code",
    id: 'checkout-io.shipping-unavailable-basket',
  },
  addressEmptyCTA: {
    defaultMessage: 'No address selected',
    id: 'checkout-io.address-empty-CTA',
  },
})

const DeliverySummary: React.FC = () => {
  const intl = useIntl()
  const {
    orderForm: { shippingData, items },
    orderLoading,
  } = useOrder()

  const { exhaustedDeliveries } = useCheckout()

  const hasSelectedAddress = shippingData.selectedAddresses.length > 0

  const history = useHistory()

  const handleEditShipping = () => {
    history.push(routes.SHIPPING)
  }

  const getDeliveryCTA = () => {
    if (!hasSelectedAddress) {
      return (
        <div className="dib ml4">
          <Tooltip label={intl.formatMessage(messages.addressEmptyCTA)}>
            <span>
              <IconInfo />
            </span>
          </Tooltip>
        </div>
      )
    }

    if (!exhaustedDeliveries) {
      return (
        <div className="dib ml4">
          <ButtonPlain onClick={handleEditShipping}>
            <IconEdit solid />
          </ButtonPlain>
        </div>
      )
    }

    return null
  }

  return (
    <div>
      <span className="t-heading-5 fw6 flex items-center">
        {intl.formatMessage(messages.delivery)}
        {getDeliveryCTA()}
      </span>
      {hasSelectedAddress && !orderLoading ? (
        <div className="flex flex-column">
          {!exhaustedDeliveries ? (
            <>
              {items.map((item: Item, index: number) => {
                const { selectedSla, slas } = shippingData.logisticsInfo[index]
                const slaInfo = slas.filter(
                  (sla: SLA) => sla.id === selectedSla
                )

                const isScheduled =
                  slaInfo.length > 0 &&
                  slaInfo[0].availableDeliveryWindows.length > 0

                const selectedDeliveryWindow =
                  isScheduled && slaInfo[0].deliveryWindow

                return (
                  <div key={index} className="flex flex-column mt4">
                    <span className="db mt2 mb3 w-100 c-on-base t-small">
                      {item.name}
                    </span>
                    <span className="ttu">
                      {slas.length > 0 ? (
                        <>
                          {selectedSla}&nbsp;
                          {isScheduled ? (
                            selectedDeliveryWindow ? (
                              <TranslateEstimate
                                scheduled={selectedDeliveryWindow}
                              />
                            ) : (
                              <span className="c-warning">
                                {intl.formatMessage(
                                  messages.noDeliveryWindowSelected
                                )}
                              </span>
                            )
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        <div className="mt2">
                          <CheckoutAlert
                            type="warning"
                            message={intl.formatMessage(
                              messages.shippingUnavailable
                            )}
                          />
                        </div>
                      )}
                    </span>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="mt5">
              <CheckoutAlert
                type="warning"
                message={intl.formatMessage(messages.shippingUnavailableBasket)}
              />
            </div>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default DeliverySummary

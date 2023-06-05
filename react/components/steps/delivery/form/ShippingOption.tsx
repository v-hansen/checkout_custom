import React, { useState, useMemo, useLayoutEffect } from 'react'
import { RadioGroup, Dropdown } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import { FormattedPrice } from 'vtex.formatted-price'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { useRuntime } from 'vtex.render-runtime'

import { getEstimateTranslation } from '../../../../utils/scheduleTranslator'
import useDisclosure from '../../../../hooks/useDisclosure'
import styles from '../Delivery.css'
import CheckoutAlert from '../../../common/CheckoutAlert'

const messages = defineMessages({
  deliveryWindow: {
    defaultMessage: 'Delivery window',
    id: 'checkout-io.delivery-window',
  },
  shippingUnavailable: {
    defaultMessage: 'No shipping method available',
    id: 'checkout-io.shipping-unavailable',
  },
})

interface Props {
  item: Item
  deliveryOptions: LogisticsInfo
  onSelectOption: (
    itemId: number,
    deliveryId: string,
    scheduleWindow?: any
  ) => void
  index: number
  selectedValue: string
}

const ShippingOption: React.FC<Props> = ({
  item,
  deliveryOptions,
  onSelectOption,
  index,
  selectedValue,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useLayoutEffect(() => {
    if (
      deliveryOptions?.slas.length === 1 &&
      deliveryOptions?.slas[0].availableDeliveryWindows.length > 0
    ) {
      onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [day, setDay] = useState<number | null>(null)
  const intl = useIntl()
  const {
    culture: { currency },
  } = useRuntime()

  const hasSchedule = deliveryOptions?.slas.filter(
    (sla: SLA) => sla.availableDeliveryWindows.length > 0
  )

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    const optionValue = String(evt?.target?.value)

    onSelectOption(index, optionValue, day)

    if (optionValue === hasSchedule[0]?.id) {
      onOpen()
    } else {
      onClose()
    }
  }

  const handleDropdownDayChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const scheduleWindow =
      hasSchedule[0].availableDeliveryWindows[Number(event?.target?.value)]

    setDay(Number(event?.target?.value))
    onSelectOption(index, selectedValue, scheduleWindow)
  }

  const getDayOptions = (windows: DeliveryWindow[]) => {
    return windows.map((date, i) => {
      const estimate = getEstimateTranslation(intl, date)

      const price = intl.formatNumber(date.price / 100, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })

      return {
        value: i,
        label: `${estimate} - ${price}`,
      }
    })
  }

  /* Because translating all schedule windows is computationally heavy,
  we only execute the options builder once per render */
  const options = useMemo(
    () =>
      hasSchedule.length > 0 &&
      getDayOptions(hasSchedule[0].availableDeliveryWindows),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const getLabelContent = (d: SLA) => {
    if (d?.availableDeliveryWindows.length > 0) {
      return (
        <div className="w-70">
          <div className="b">{d?.id}</div>
          <div className={styles.scheduledDropdowns}>
            <div className="mt5">
              <Dropdown
                label={intl.formatMessage(messages.deliveryWindow)}
                options={options}
                onChange={handleDropdownDayChange}
                value={day !== null ? Number(day) : null}
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="b mb3">{d?.id}</div>
        <div className="c-muted-1 f6">
          <FormattedPrice value={d?.price / 100} />
          {d?.shippingEstimate ? (
            <TranslateEstimate shippingEstimate={d?.shippingEstimate} />
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }

  const getRadioGroupOptions = (delivery: LogisticsInfo) => {
    return delivery.slas.map((d: SLA) => ({
      value: d?.id,
      label: getLabelContent(d),
      disabled: d?.deliveryChannel === 'pickup-in-point',
    }))
  }

  const availableShippingOptions = getRadioGroupOptions(deliveryOptions)

  return (
    <div className={`mt7 ${isOpen ? styles.scheduleActive : ''}`}>
      {availableShippingOptions.length > 0 ? (
        <RadioGroup
          label={`${item?.name} - ID: ${item?.id}`}
          name={item?.id}
          options={availableShippingOptions}
          value={selectedValue}
          onChange={handleRadioChange}
        />
      ) : (
        <>
          <span className="db mb3 w-100 c-on-base t-small">
            {item?.name} - ID: {item?.id}
          </span>
          <div className="mt2">
            <CheckoutAlert
              type="warning"
              message={intl.formatMessage(messages.shippingUnavailable)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ShippingOption

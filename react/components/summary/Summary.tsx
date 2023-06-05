import React from 'react'
import { Divider } from 'vtex.styleguide'
import { FormattedPrice } from 'vtex.formatted-price'
import { useIntl, defineMessages } from 'react-intl'

import { useOrder } from '../../providers/orderform'
import Styles from './Summary.css'

/**
 * @returns a simple summary of the orderform items
 * and all the total values
 */
const CheckoutSummary: React.FC = () => {
  const intl = useIntl()
  const { orderForm } = useOrder()
  const { items, totalizers, value } = orderForm

  return (
    <>
      <h4 className="t-heading-5 mv6">
        {intl.formatMessage(messages.summary)}
      </h4>
      <div className="mv3">
        <Divider orientation="horizontal" />
      </div>
      <div>
        <ul className={Styles.summaryProductList}>
          {items.map((item: Item, i: number) => {
            return (
              <li className="pv4" key={i}>
                <div className={Styles.container}>
                  <div className={Styles.image}>
                    <img
                      height="45"
                      width="45"
                      src={item?.imageUrl}
                      alt={item?.name}
                    />
                  </div>
                  <div className={`${Styles.description} ph4 c-on-base`}>
                    <div className={`${Styles.name} t-small`}>{item?.name}</div>
                    <div className={`${Styles.quantity} t-mini`}>
                      {`${intl.formatMessage(messages.qty)} ${item?.quantity}`}
                    </div>
                  </div>
                  <div className={Styles.price}>
                    <FormattedPrice value={item?.price / 100} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mv3">
        <Divider orientation="horizontal" />
      </div>
      <div>
        {totalizers.map((total: Totalizer, i: number) => {
          return (
            <div key={i} className="flex flex-row justify-between">
              <p>{total?.name}{' '}</p>
              <span className="flex items-center">
                <FormattedPrice value={Number(total?.value) / 100} />
              </span>
            </div>
          )
        })}

        <h5 className="t-heading-5 flex flex-row justify-between b">
          {intl.formatMessage(messages.total)}{' '}
          <FormattedPrice value={value > 0 ? value / 100 : null} />
        </h5>
      </div>
    </>
  )
}

const messages = defineMessages({
  summary: {
    defaultMessage: 'Summary',
    id: 'checkout-io.summary',
  },
  qty: {
    defaultMessage: 'Qty.',
    id: 'checkout-io.qty',
  },
  total: {
    defaultMessage: 'Total',
    id: 'checkout-io.total',
  },
})

export default CheckoutSummary

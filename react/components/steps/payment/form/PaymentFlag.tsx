import React, { PureComponent } from 'react'

import Cash from './flags/Cash'
import GiftCard from './flags/GiftCard'
import GenericCard from './flags/GenericCard'

interface Props {
  paymentSystemGroup: string
}

class PaymentFlag extends PureComponent<Props> {
  public render() {
    const { paymentSystemGroup } = this.props

    let Flag;

    switch (paymentSystemGroup) {
      case 'giftCardPaymentGroup':
        Flag = GiftCard
        break;
      case 'creditCardPaymentGroup':
        Flag = GenericCard
        break;
      default:
        Flag = Cash
        break;
    }

    return <Flag />
  }
}

export default PaymentFlag

import React from 'react'
import { Switch, Route } from 'react-router'

import routes from '../../../utils/routes'
import Step from '../../step-group/Step'
import PaymentForm from './form/PaymentForm'
import PaymentSummary from './PaymentSummary'

const PaymentStep: React.FC = () => {
  return (
    <Step>
      <Switch>
        <Route path={routes.PAYMENT}>
          <PaymentForm />
        </Route>
        <Route path="*">
          <PaymentSummary />
        </Route>
      </Switch>
    </Step>
  )
}

export default PaymentStep

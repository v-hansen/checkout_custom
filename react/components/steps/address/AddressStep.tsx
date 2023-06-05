import React from 'react'
import { Switch, Route } from 'react-router'

import routes from '../../../utils/routes'
import Step from '../../step-group/Step'
import AddressForm from './form/AddressForm'
import AddressSummary from './AddressSummary'

const AddressStep: React.FC = () => {
  return (
    <Step>
      <Switch>
        <Route path={routes.ADDRESS}>
          <AddressForm />
        </Route>
        <Route path="*">
          <AddressSummary />
        </Route>
      </Switch>
    </Step>
  )
}

export default AddressStep

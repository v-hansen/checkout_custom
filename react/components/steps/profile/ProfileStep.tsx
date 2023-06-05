import React from 'react'
import { Switch, Route } from 'react-router'

import routes from '../../../utils/routes'
import Step from '../../step-group/Step'
import ProfileForm from './form/ProfileForm'
import ProfileSummary from './ProfileSummary'

const ProfileStep: React.FC = () => {
  return (
    <Step>
      <Switch>
        <Route path={routes.PROFILE}>
          <ProfileForm />
        </Route>
        <Route path="*">
          <ProfileSummary />
        </Route>
      </Switch>
    </Step>
  )
}

export default ProfileStep

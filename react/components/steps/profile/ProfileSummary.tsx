import React from 'react'
import { ButtonPlain, IconEdit, IconCheck } from 'vtex.styleguide'
import { useHistory } from 'react-router'
import { useIntl, defineMessages } from 'react-intl'

import routes from '../../../utils/routes'
import { useOrder } from '../../../providers/orderform'

const messages = defineMessages({
  profile: {
    defaultMessage: 'Profile',
    id: 'checkout-io.profile',
  },
  subscribed: {
    defaultMessage: 'Subscribed',
    id: 'checkout-io.subscribed',
  },
})

const ProfileSummary: React.FC = () => {
  const intl = useIntl()
  const {
    orderForm: { clientProfileData, clientPreferencesData },
  } = useOrder()

  const {
    firstName,
    lastName,
    document,
    documentType,
    phone,
  } = clientProfileData

  const history = useHistory()

  const handleEditProfile = () => {
    history.push(routes.PROFILE)
  }

  return (
    <>
      <div>
        <span className="t-heading-5 fw6 flex items-center">
          {intl.formatMessage(messages.profile)}
          <div className="dib ml4">
            <ButtonPlain onClick={handleEditProfile}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>
      </div>
      <div className="flex flex-column flex-row-ns ">
        <span className="dib mt3">{clientProfileData?.email}</span>
      </div>
      {(firstName || lastName) && (
        <div className="flex flex-column flex-row-ns mt4">
          {`${firstName ?? ''} ${lastName ?? ''}`}
        </div>
      )}
      {(document || documentType) && (
        <div className="flex flex-column flex-row-ns mt4">
          {`${documentType ?? ''} ${document ?? ''}`}
        </div>
      )}
      {phone && <div className="flex flex-column flex-row-ns mt4">{phone}</div>}
      {clientPreferencesData.optinNewsLetter && (
        <div className="flex flex-column flex-row-ns mt4">
          <span className="inlineBlock">
            <IconCheck /> {intl.formatMessage(messages.subscribed)}
          </span>
        </div>
      )}
    </>
  )
}

export default ProfileSummary

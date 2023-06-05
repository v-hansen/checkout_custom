import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ButtonPlain } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl, defineMessages } from 'react-intl'

import ProfileEditableForm from './ProfileEditableForm'
import ProfileFormSummary from './ProfileFormSummary'
import StepHeader from '../../../step-group/StepHeader'
import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import { useForm } from '../../../../hooks/useForm'
import { useOrder } from '../../../../providers/orderform'
import routes from '../../../../utils/routes'
import endpoints from '../../../../utils/endpoints'
import { ProfileFields } from '../../../common/ValidFields'
import {
  getClientPreferencesDataFormatted,
  getProfileFormatted,
  hasValidFields,
} from '../../../../utils'
import CheckoutAlert from '../../../common/CheckoutAlert'

const ProfileForm: React.FC = () => {
  const intl = useIntl()
  const { navigate, culture } = useRuntime()
  const { orderForm, orderError, refreshOrder } = useOrder()

  const {
    clientProfileData,
    clientPreferencesData,
    orderFormId,
    canEditData,
  } = orderForm

  const history = useHistory()
  const [profileResponse, fetchingProfile, requestProfile] = useFetch(
    {} as RequestInfo
  )

  const [
    preferencesResponse,
    fetchingPreferences,
    requestPreferences,
  ] = useFetch({} as RequestInfo)

  const [clientProfile, handleProfileChange] = useForm<ClientProfile>(
    getProfileFormatted(clientProfileData)
  )

  const [clientPreferences, handlePreferencesChange] = useForm<
    ClientPreferences
  >(getClientPreferencesDataFormatted(clientPreferencesData, culture?.locale))

  const [validForm, setValidForm] = useState(true)
  const [showAlertError, setShowAlertError] = useState(false)

  useEffect(() => {
    if (orderError) {
      setShowAlertError(true)
    }
  }, [orderError])

  useEffect(() => {
    if (
      !fetchingProfile &&
      profileResponse?.Data?.orderForm?.orderFormId &&
      !fetchingPreferences &&
      preferencesResponse?.Data?.orderForm?.orderFormId
    ) {
      refreshOrder().then(() => {
        history.push(routes.INDEX)
      })
    } else if (!fetchingProfile && profileResponse.hasError) {
      setShowAlertError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchingProfile,
    profileResponse,
    fetchingPreferences,
    preferencesResponse,
  ])

  useEffect(() => {
    setValidForm(hasValidFields(clientProfile, ProfileFields))
  }, [clientProfile])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()
    if (validForm) {
      requestProfile({
        Method: 'POST',
        EndPoint: `${endpoints.PROFILE}`,
        RequestBody: {
          orderFormId,
          fields: {
            ...clientProfile,
          },
        },
      })
      requestPreferences({
        Method: 'POST',
        EndPoint: `${endpoints.CLIENT_PREFERENCE_DATA}`,
        RequestBody: {
          orderFormId,
          clientPreferencesData: {
            ...clientPreferences,
          },
        },
      })
    }
  }

  const handleCloseAlertError = () => {
    setShowAlertError(false)
  }

  const handleEditEmail = () => {
    history.push(routes.INDEX)
    navigate({ page: 'store.checkout.identification' })
  }

  return (
    <>
      <div className="flex flex-column">
        <span className="t-heading-5 fw6">
          {intl.formatMessage(messages.email)}
        </span>
        <span className="flex items-center mt3">
          {clientProfile?.email}&nbsp;
          <ButtonPlain onClick={handleEditEmail}>
            {intl.formatMessage(messages.change)}
          </ButtonPlain>
        </span>
      </div>

      <div className="mt6">
        <StepHeader
          title={intl.formatMessage(messages.profile)}
          canEditData={canEditData}
        />
      </div>

      {canEditData ? (
        <ProfileEditableForm
          validForm={validForm}
          handleSubmit={handleSubmit}
          clientProfile={clientProfile}
          clientPreferences={clientPreferences}
          handleProfile={handleProfileChange}
          handlePreference={handlePreferencesChange}
          isFetching={fetchingProfile || fetchingPreferences}
        />
      ) : (
        <ProfileFormSummary
          firstName={clientProfile.firstName}
          lastName={clientProfile.lastName}
          phone={clientProfile.phone}
        />
      )}

      {showAlertError && (
        <div className="mt5">
          <CheckoutAlert
            message={intl.formatMessage(messages.requestError)}
            orderError={orderError}
            handleCloseAlertError={handleCloseAlertError}
          />
        </div>
      )}
    </>
  )
}

const messages = defineMessages({
  email: {
    defaultMessage: 'Email',
    id: 'checkout-io.email',
  },
  change: {
    defaultMessage: 'Change',
    id: 'checkout-io.change',
  },
  profile: {
    defaultMessage: 'Profile',
    id: 'checkout-io.profile',
  },
  requestError: {
    defaultMessage: 'Request failed, try again',
    id: 'checkout-io.request-error',
  },
})

export default ProfileForm

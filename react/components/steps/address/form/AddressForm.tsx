import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'

import AddressFormSummary from './AddressFormSummary'
import { useOrder } from '../../../../providers/orderform'
import StepHeader from '../../../step-group/StepHeader'
import AddressEditableForm from './AddressEditableForm'
import CheckoutAlert from '../../../common/CheckoutAlert'

const messages = defineMessages({
  address: {
    defaultMessage: 'Address',
    id: 'checkout-io.address',
  },
  requestError: {
    defaultMessage: 'Request failed, try again',
    id: 'checkout-io.request-error',
  },
  invalidPostalCode: {
    defaultMessage: 'No shipping method available',
    id: 'checkout-io.invalid-postal-code',
  },
})

const AddressForm: React.FC = () => {
  const intl = useIntl()
  const { orderForm, orderError } = useOrder()
  const [showAlertError, setShowAlertError] = useState(false)
  const [showAlertWarning, setShowAlertWarning] = useState(false)

  const { canEditData, shippingData } = orderForm

  const selectedAddress = shippingData?.selectedAddresses[0]

  const [showAddressSummary, setShowAddressSummary] = useState(
    !!selectedAddress?.addressId
  )

  const [dataError, setDataError] = useState(null)

  const handleCloseAlertError = () => {
    setShowAlertError(false)
  }

  const handleCloseAlertWarning = () => {
    setShowAlertWarning(false)
  }

  return (
    <>
      <StepHeader
        title={intl.formatMessage(messages.address)}
        canEditData={canEditData}
      />
      <div className="mt6">
        {(showAddressSummary || !canEditData) && (
          <AddressFormSummary address={selectedAddress} />
        )}

        {canEditData && (
          // TODO: return errorData
          <AddressEditableForm
            setShowAlertWarning={setShowAlertWarning}
            setShowAddressSummary={setShowAddressSummary}
            setDataError={setDataError}
          />
        )}

        {(showAlertError || orderError || dataError) && (
          <div className="mt5">
            <CheckoutAlert
              message={intl.formatMessage(messages.requestError)}
              orderError={orderError}
              handleCloseAlertError={handleCloseAlertError}
            />
          </div>
        )}

        {showAlertWarning && (
          <div className="mt5">
            <CheckoutAlert
              type="warning"
              message={intl.formatMessage(messages.invalidPostalCode)}
              orderError={orderError}
              handleCloseAlertError={handleCloseAlertWarning}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AddressForm

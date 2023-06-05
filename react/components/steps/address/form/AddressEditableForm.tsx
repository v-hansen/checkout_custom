import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Input, Button } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

import SearchAddress from './SearchAddress'
import { useForm } from '../../../../hooks/useForm'
import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import { useOrder } from '../../../../providers/orderform'
import { getAddressFormatted, hasValidFields } from '../../../../utils'
import endpoints from '../../../../utils/endpoints'
import routes from '../../../../utils/routes'
import { AddressFields } from '../../../common/ValidFields'
import InputLabel from '../../../common/InputLabel'

interface AddressEditableFormProps {
  showSearchAddress?: boolean
  setShowAlertWarning: any
  setShowAddressSummary: any
  setDataError: any
}

const messages = defineMessages({
  street: {
    defaultMessage: 'Street',
    id: 'checkout-io.street',
  },
  number: {
    defaultMessage: 'Number',
    id: 'checkout-io.number',
  },
  city: {
    defaultMessage: 'City',
    id: 'checkout-io.city',
  },
  state: {
    defaultMessage: 'State',
    id: 'checkout-io.state',
  },
  complement: {
    defaultMessage: 'Complement',
    id: 'checkout-io.complement',
  },
  reference: {
    defaultMessage: 'Reference',
    id: 'checkout-io.reference',
  },
  neighborhood: {
    defaultMessage: 'Neighborhood',
    id: 'checkout-io.neighborhood',
  },
  receiverName: {
    defaultMessage: 'Receiver name',
    id: 'checkout-io.receiver-name',
  },
  save: {
    defaultMessage: 'Save',
    id: 'checkout-io.save',
  },
})

const AddressEditableForm: React.FC<AddressEditableFormProps> = ({
  setShowAlertWarning,
  setShowAddressSummary,
  setDataError,
}) => {
  const intl = useIntl()
  const history = useHistory()

  const { orderForm, refreshOrder } = useOrder()

  const { storePreferencesData, shippingData, orderFormId } = orderForm

  const [validForm, setValidForm] = useState(true)
  const [hasLoadAddress, setHasLoadAddress] = useState(false)

  const [
    updateAddressResponse,
    isFetchingUpdateAddress,
    setRequestUpdateAddress,
  ] = useFetch({} as RequestInfo)

  const country = storePreferencesData?.countryCode ?? ''
  const addressId = shippingData?.address?.addressId ?? ''
  const [address, handleInputChange, reset] = useForm<Address>(
    getAddressFormatted(shippingData?.selectedAddresses[0])
  )

  useEffect(() => {
    if (address) {
      const valid = hasValidFields(getAddressFormatted(address), AddressFields)

      setValidForm(valid)
    }
  }, [address])

  useEffect(() => {
    if (
      !isFetchingUpdateAddress &&
      updateAddressResponse?.Data?.orderForm?.orderFormId
    ) {
      refreshOrder().then(() => {
        history.push(routes.INDEX)
      })
    } else if (!isFetchingUpdateAddress && updateAddressResponse?.hasError) {
      setDataError(updateAddressResponse?.Data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUpdateAddress, updateAddressResponse])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    const shipping = {
      selectedAddresses: [
        {
          ...address,
          ...(addressId ? { addressId } : ''),
          country,
          addressType: 'residential',
        },
      ],
    }

    if (validForm) {
      setRequestUpdateAddress({
        Method: 'POST',
        EndPoint: `${endpoints.SHIPPING}`,
        RequestBody: {
          orderFormId,
          shipping,
        },
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* {(!orderForm?.shippingData?.selectedAddresses[0]?.addressId ||
          showSearchAddress) && (
          <SearchAddress
            setDataError={setDataError}
            setShowAlertWarning={setShowAlertWarning}
            setHasLoadAddress={setHasLoadAddress}
            reset={reset}
            setShowAddressSummary={setShowAddressSummary}
          />
        )} */}

        <SearchAddress
          setDataError={setDataError}
          setShowAlertWarning={setShowAlertWarning}
          setHasLoadAddress={setHasLoadAddress}
          reset={reset}
          setShowAddressSummary={setShowAddressSummary}
        />

        {hasLoadAddress && (
          <div>
            <div className="flex flex-column flex-row-ns mt3">
              <div className="w-100" data-testid="address-street-wrapper">
                <Input
                  label={
                    <InputLabel
                      name={intl.formatMessage(messages.street)}
                      isRequired
                    />
                  }
                  name="street"
                  value={address?.street}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-column flex-row-ns mt3">
              <div className="w-100" data-testid="address-number-wrapper">
                <Input
                  label={
                    <InputLabel
                      name={intl.formatMessage(messages.number)}
                      isRequired
                    />
                  }
                  name="number"
                  value={address?.number}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="w-100 mt6 mt0-ns ml0 ml5-ns"
                data-testid="address-city-wrapper"
              >
                <Input
                  label={
                    <InputLabel
                      name={intl.formatMessage(messages.city)}
                      isRequired
                    />
                  }
                  name="city"
                  value={address?.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-column flex-row-ns mt3">
              <div className="w-100" data-testid="address-state-wrapper">
                <Input
                  label={intl.formatMessage(messages.state)}
                  name="state"
                  value={address?.state}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="w-100 mt6 mt0-ns ml0 ml5-ns"
                data-testid="address-complement-wrapper"
              >
                <Input
                  label={intl.formatMessage(messages.complement)}
                  name="complement"
                  value={address?.complement}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-column flex-row-ns mt3">
              <div className="w-100" data-testid="address-reference-wrapper">
                <Input
                  label={intl.formatMessage(messages.reference)}
                  name="reference"
                  value={address?.reference}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="w-100 mt6 mt0-ns ml0 ml5-ns"
                data-testid="address-neighborhood-wrapper"
              >
                <Input
                  label={intl.formatMessage(messages.neighborhood)}
                  name="neighborhood"
                  value={address?.neighborhood}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-column flex-row-ns mt3">
              <div className="w-100" data-testid="address-receiverName-wrapper">
                <Input
                  label={intl.formatMessage(messages.receiverName)}
                  name="receiverName"
                  value={address?.receiverName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div
              className="mt6"
              id="demo"
              data-testid="address-continue-wrapper"
            >
              <Button
                size="large"
                type="submit"
                block
                disabled={!validForm}
                isLoading={isFetchingUpdateAddress}
              >
                <span className="f5">{intl.formatMessage(messages.save)}</span>
              </Button>
            </div>
          </div>
        )}
      </form>
    </>
  )
}

export default AddressEditableForm

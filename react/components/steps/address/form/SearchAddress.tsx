import React, { useEffect } from 'react'
import { Input, Button, IconSearch } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

import { useForm } from '../../../../hooks/useForm'
import useFetch, { RequestInfo } from '../../../../hooks/useFetch'
import { useOrder } from '../../../../providers/orderform'
import { getAddressFormatted } from '../../../../utils'
import endpoints from '../../../../utils/endpoints'
import styles from '../AddressStyles.css'

const messages = defineMessages({
  postalCode: {
    defaultMessage: 'Postal Code',
    id: 'checkout-io.postal-code',
  },
})

interface SearchAddressProps {
  setDataError: any
  setShowAlertWarning: any
  setHasLoadAddress: any
  reset: any
  setShowAddressSummary: any
}

const SearchAddress: React.FC<SearchAddressProps> = ({
  setDataError,
  setShowAlertWarning,
  setHasLoadAddress,
  reset,
  setShowAddressSummary,
}) => {
  const intl = useIntl()
  const { orderForm, refreshOrder } = useOrder()

  const country = orderForm?.storePreferencesData?.countryCode ?? ''

  const [address, handleInputChange] = useForm<Address>(
    getAddressFormatted(orderForm?.shippingData?.selectedAddresses[0])
  )

  const [responseInfo, isFetching, setRequest] = useFetch({} as RequestInfo)
  const [
    responseUpdateShipping,
    isUpdateShippingFetching,
    setUpdateShippingRequest,
  ] = useFetch({} as RequestInfo)

  useEffect(() => {
    if (!isFetching && responseInfo?.Data) {
      if (responseInfo?.Data?.address) {
        reset(getAddressFormatted(responseInfo?.Data?.address))
        setHasLoadAddress(true)

        const shipping = {
          selectedAddresses: [
            {
              ...responseInfo?.Data?.address,
            },
          ],
        }

        setUpdateShippingRequest({
          Method: 'POST',
          EndPoint: `${endpoints.SHIPPING}`,
          RequestBody: {
            orderFormId: orderForm?.orderFormId,
            shipping,
          },
        })
      } else {
        setHasLoadAddress(false)
        setShowAlertWarning(true)
      }
    } else if (!isFetching && responseInfo?.hasError) {
      setHasLoadAddress(false)
      setDataError(responseInfo?.Data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, responseInfo])

  useEffect(() => {
    if (!isUpdateShippingFetching && responseUpdateShipping?.Data) {
      if (responseUpdateShipping?.Data?.orderForm) {
        refreshOrder().then(() => setHasLoadAddress(true))
      } else {
        setHasLoadAddress(false)
        setShowAlertWarning(true)
      }
    } else if (!isUpdateShippingFetching && responseUpdateShipping?.hasError) {
      setHasLoadAddress(false)
      setDataError(responseUpdateShipping?.Data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateShippingFetching, responseUpdateShipping])

  const handleGetAddress: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    // eslint-disable-next-line vtex/prefer-early-return
    if (country && address.postalCode) {
      setShowAddressSummary(false)
      setDataError(null)
      setShowAlertWarning(false)
      setRequest({
        Method: 'GET',
        EndPoint: `${endpoints.ADDRESS}/${country}/${address.postalCode}`,
      })
    }
  }

  return (
    <>
      <div className="flex flex-column flex-row-ns">
        <div
          className={`${styles.locationInput} w-50`}
          data-testid="address-postal-code-wrapper"
        >
          <Input
            label={intl.formatMessage(messages.postalCode)}
            name="postalCode"
            value={address?.postalCode}
            onChange={handleInputChange}
            suffix={
              <Button
                disabled={!address?.postalCode}
                id="submit-postal-code-button"
                type="submit"
                onClick={handleGetAddress}
                isLoading={isFetching}
                style="padding: 0;"
              >
                <IconSearch />
              </Button>
            }
          />
        </div>
      </div>
    </>
  )
}

export default SearchAddress

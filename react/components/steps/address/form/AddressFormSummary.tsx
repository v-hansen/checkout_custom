import React from 'react'
import { Box, Divider } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

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
  postalCode: {
    defaultMessage: 'Postal Code',
    id: 'checkout-io.postal-code',
  },
  selectedAddress: {
    defaultMessage: 'Selected Address',
    id: 'checkout-io.selected-Address',
  },
  receiver: {
    defaultMessage: 'Receiver',
    id: 'checkout-io.receiver',
  },
})

const AddressFormSummary = ({ address }: { address: Address }) => {
  const intl = useIntl()

  return (
    <>
      <div className="pb5 w-100">
        <Box>
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 flex justify-between">
              <span className="dib fw6">
                {address?.reference
                  ? address?.reference
                  : intl.formatMessage(messages.selectedAddress)}
              </span>
            </div>
          </div>
          <div className="mv3">
            <Divider orientation="horizontal" />
          </div>
          <div className="mid-gray">
            <div className="flex flex-column flex-row-ns">
              <div className="w-100 mb3">
                {intl.formatMessage(messages.postalCode)}: {address?.postalCode}
              </div>
              <div className="w-100 mb3 mt0-ns ml0 ml5-ns">
                {intl.formatMessage(messages.street)}: {address?.street}
              </div>
            </div>
            <div className="flex flex-column flex-row-ns">
              <div className="w-100 mb3">
                {intl.formatMessage(messages.number)}: {address?.number}
              </div>
              <div className="w-100 mb3 mt0-ns ml0 ml5-ns">
                {intl.formatMessage(messages.city)}: {address?.city}
              </div>
            </div>
            <div className="flex flex-column flex-row-ns">
              <div className="w-100 mb3">
                {intl.formatMessage(messages.state)}: {address?.state}
              </div>
              <div className="w-100 mb3 mt0-ns ml0 ml5-ns">
                {intl.formatMessage(messages.complement)}: {address?.complement}
              </div>
            </div>
            <div className="flex flex-column flex-row-ns">
              <div className="w-100 mb3">
                {intl.formatMessage(messages.neighborhood)}:{' '}
                {address?.neighborhood}
              </div>
              <div className="w-100 mb3 mt0-ns ml0 ml5-ns">
                {intl.formatMessage(messages.receiver)}: {address?.receiverName}
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  )
}

export default AddressFormSummary

import React from 'react'
import { Input, Button, Toggle } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl, defineMessages } from 'react-intl'

const ProfileEditableForm = ({
  validForm,
  handleSubmit,
  clientProfile,
  clientPreferences,
  handleProfile,
  handlePreference,
  isFetching,
}: any) => {
  const intl = useIntl()
  const { deviceInfo } = useRuntime()

  const optinNewsLetterLabel = intl.formatMessage(messages.optinNewsLetter)

  return (
    <form className="mt6" onSubmit={handleSubmit}>
      <div className="flex flex-column flex-row-ns mt3">
        <div className="w-100" data-testid="profile-first-name-wrapper">
          <Input
            label={intl.formatMessage(messages.firstName)}
            name="firstName"
            value={clientProfile?.firstName}
            onChange={handleProfile}
          />
        </div>
        <div
          className="w-100 mt6 mt0-ns ml0 ml5-ns"
          data-testid="profile-last-name-wrapper"
        >
          <Input
            label={intl.formatMessage(messages.lastName)}
            name="lastName"
            value={clientProfile?.lastName}
            onChange={handleProfile}
          />
        </div>
      </div>
      <div className="flex flex-column flex-row-ns mt3">
        <div className="w-100" data-testid="profile-document-wrapper">
          <Input
            label={intl.formatMessage(messages.document)}
            name="document"
            value={clientProfile?.document}
            onChange={handleProfile}
          />
        </div>
        <div
          className="w-100 mt6 mt0-ns ml0 ml5-ns"
          data-testid="profile-document-type-wrapper"
        >
          <Input
            label={intl.formatMessage(messages.documentType)}
            name="documentType"
            value={clientProfile?.documentType}
            onChange={handleProfile}
          />
        </div>
      </div>
      <div className="flex flex-column flex-row-ns mt3">
        <div className="w-100" data-testid="profile-phone-wrapper">
          <Input
            label={intl.formatMessage(messages.phone)}
            name="phone"
            value={clientProfile?.phone}
            onChange={handleProfile}
          />
        </div>
      </div>
      <div className="mv7">
        <div className="mt6">
          <Toggle
            name="optinNewsLetter"
            label={optinNewsLetterLabel}
            size={deviceInfo.isMobile ? 'large' : 'regular'}
            checked={clientPreferences?.optinNewsLetter}
            onChange={handlePreference}
          />
        </div>
      </div>
      <div data-testid="profile-continue-wrapper">
        <Button
          size="large"
          type="submit"
          disabled={!validForm}
          isLoading={isFetching}
          block
        >
          <span className="f5">{intl.formatMessage(messages.save)}</span>
        </Button>
      </div>
    </form>
  )
}

const messages = defineMessages({
  firstName: {
    defaultMessage: 'First Name',
    id: 'checkout-io.first-name',
  },
  lastName: {
    defaultMessage: 'Last Name',
    id: 'checkout-io.last-name',
  },
  document: {
    defaultMessage: 'Document',
    id: 'checkout-io.document',
  },
  documentType: {
    defaultMessage: 'Document Type',
    id: 'checkout-io.document-type',
  },
  phone: {
    defaultMessage: 'Phone',
    id: 'checkout-io.phone',
  },
  optinNewsLetter: {
    defaultMessage: 'Subscribe to our newsletter',
    id: 'checkout-io.subscribe-to-our-newsletter',
  },
  save: {
    defaultMessage: 'Save',
    id: 'checkout-io.save',
  },
})

export default ProfileEditableForm

export const getProfileFormatted = (profile: ClientProfile) => {
  return {
    email: profile?.email ?? '',
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    documentType: profile?.documentType ?? '',
    document: profile?.document ?? '',
    phone: profile?.phone ?? '',
  } as ClientProfile
}

export const getAddressFormatted = (address: Address) => {
  return {
    postalCode: address?.postalCode ?? '',
    street: address?.street ?? '',
    number: address?.number ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    complement: address?.complement ?? '',
    reference: address?.reference ?? '',
    receiverName: address?.receiverName ?? '',
    neighborhood: address?.neighborhood ?? '',
    geoCoordinates: address?.geoCoordinates ?? [0, 0],
  } as Address
}

export const getClientPreferencesDataFormatted = (
  preference: ClientPreferences,
  currentLocale = ''
) => {
  return {
    optinNewsLetter: preference?.optinNewsLetter ?? false,
    locale: preference?.locale ?? currentLocale,
  } as ClientPreferences
}

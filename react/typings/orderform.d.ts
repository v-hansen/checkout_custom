type OrderForm = {
  orderFormId: string
  canEditData: boolean
  clientPreferencesData: ClientPreferences
  clientProfileData: ClientProfile
  items: Item[]
  loggedIn: boolean
  paymentData: PaymentData
  salesChannel: string
  sellers: Seller[]
  shippingData: ShippingData
  storePreferencesData: StorePreferences
  totalizers: Totalizer[]
  userProfileId: string
  userType: string
  value: number
}

type ClientPreferences = {
  locale: string
  optinNewsLetter: boolean
}

type ClientProfile = {
  email: string
  firstName: string
  lastName: string
  phone: string
  isCorporate: boolean
  corporateDocument: string
  corporateName: string
  corporatePhone: string
  document: string
  documentType: string
  stateInscription: string
  tradeName: string
}

type Item = {
  id: string
  name: string
  detailUrl: string
  imageUrl: string
  skuName: string
  productRefId: string
  quantity: number
  uniqueId: string
  productId: string
  refId: string
  ean: string
  priceValidUntil: string
  price: number
  tax: number
  listPrice: number
  sellingPrice: number
  rewardValue: number
  isGift: boolean
  parentItemIndex: number
  parentAssemblyBinding: string
  seller: string
  productCategoryIds: string
  productCategories: Record<string, string>
  measurementUnit: string
  unitMultiplier: number
}

type Seller = {
  id: string
  name: string
}

type ShippingData = {
  address: Address
  availableAddresses: Address[]
  selectedAddresses: Address[]
  logisticsInfo: LogisticsInfo[]
}

type Address = {
  addressId: string
  cacheId: string
  id: string
  userId: string
  receiverName: string
  complement: string
  neighborhood: string
  country: string
  state: string
  number: string
  street: string
  geoCoordinates: number[]
  postalCode: string
  city: string
  reference: string
  addressName: string
  addressType: string
}

type LogisticsInfo = {
  addressId: string
  itemId: string
  itemIndex: number
  selectedSla: string
  slas: SLA[]
}

type SLA = {
  availableDeliveryWindows: DeliveryWindow[]
  deliveryChannel: string
  deliveryWindow: DeliveryWindow
  id: string
  name: string
  price: number
  shippingEstimate: string
  shippingEstimateDate: string
}

type DeliveryWindow = {
  startDateUtc: string
  endDateUtc: string
  price: number
  lisPrice: number
  tax: number
}

type StorePreferences = {
  countryCode: string
  currencyCode: string
  timeZone: string
  currencyFormatInfo: CurrencyFormatInfo
  currencySymbol: string
}

type CurrencyFormatInfo = {
  currencyDecimalDigits: number
  currencyDecimalSeparator: string
  currencyGroupSeparator: string
  startsWithCurrencySymbol: boolean
}

type Totalizer = {
  id: string
  name: string
  value: number
}

type PaymentData = {
  availableAccounts: AvailableAccount[]
  paymentSystems: PaymentSystem[]
  payments: Payment[]
  updateStatus: string
}

type AvailableAccount = {
  accountId: string
  paymentSystem: string
  paymentSystemName: string
  cardNumber: string
}

type PaymentSystem = {
  id: string
  name: string
  groupName: string
  validator: Validator
  stringId: string
  requiresDocument: boolean
  isCustom: boolean
  description: string
  requiresAuthentication: boolean
  dueDate: string
}

type Validator = {
  regex: string
  mask: string
  cardCodeRegex: string
  cardCodeMask: string
  weights: number[]
  useCvv: boolean
  useExpirationDate: boolean
  useCardHolderName: boolean
  useBillingAddress: boolean
}

type Payment = {
  paymentSystem: string
  bin: string
  accountId: string
  tokenId: string
  installments: number
  referenceValue: number
  value: number
}

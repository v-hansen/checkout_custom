import { RenderContext } from 'vtex.render-runtime'

declare global {
  // eslint-disable-next-line no-redeclare
  const __RUNTIME__: RenderContext

  interface CardFormData {
    encryptedCardNumber: string
    encryptedCardHolder: string
    encryptedExpiryDate: string
    encryptedCsc: string
    lastDigits: string
    paymentSystem: string
    installment?: number
  }

  interface PaymentInput {
    paymentSystem?: string
    paymentSystemName?: string
    group?: string
    tokenId?: string
    installments?: number
    installmentsInterestRate?: number
    referenceValue?: number
    value?: number
  }

  interface PaymentDataInput {
    payments: PaymentInput[]
  }

  type CardType = 'new' | 'saved'
}

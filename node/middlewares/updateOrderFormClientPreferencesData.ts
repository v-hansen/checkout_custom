import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addclientpreferences
 */
export async function updateOrderFormClientPreferencesData(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, clientPreferencesData } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!clientPreferencesData) {
    throw new UserInputError('clientPreferencesData is required')
  }

  try {
    const response = await checkoutClient.updateOrderFormClientPreferencesData(
      orderFormId,
      clientPreferencesData
    )

    ctx.status = 200
    ctx.body = {
      orderForm: response,
    }

    await next()
  } catch (error) {
    console.log('## error.response.data', error.response.data)
    throw new Error(error)
  }
}

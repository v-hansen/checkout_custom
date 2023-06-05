import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addclientprofile
 */
export async function updateOrderFormProfile(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, fields } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!fields) {
    throw new UserInputError('fields is required')
  }

  try {
    const response = await checkoutClient.updateOrderFormProfile(
      orderFormId,
      fields
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

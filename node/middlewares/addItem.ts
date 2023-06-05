import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addpaymentdata
 */
export async function addItem(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, items } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('An orderFormId was not provided')
  }

  if (!items) {
    throw new UserInputError('Items were not provided')
  }

  try {
    const response = await checkoutClient.addItem(orderFormId, items)

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

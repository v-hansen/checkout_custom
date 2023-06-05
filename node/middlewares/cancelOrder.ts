import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/orders#cancelorder
 */
export async function cancelOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, reason } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('An orderFormId is required')
  }

  if (!reason) {
    throw new UserInputError(
      'A reason for cancellation is required (string format)'
    )
  }

  try {
    const response = await checkoutClient.cancelOrder(orderFormId, reason)

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

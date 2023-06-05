import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/shopping-cart#getcurrentcartorcreateanewone
 */
export async function newOrderForm(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  try {
    const response = await checkoutClient.newOrderForm(orderFormId)

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

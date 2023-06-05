import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

import { getOrderFormIdFromCookie } from '../utils/cookie'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/shopping-cart#getcartinformationbyid
 */
export async function orderForm(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
    cookies,
  } = ctx

  const { orderFormId } = await json(ctx.req)

  const checkoutOrderFormId = getOrderFormIdFromCookie(cookies)

  if (!orderFormId && !checkoutOrderFormId) {
    throw new UserInputError(
      'To retrieve an orderForm, an orderFormId is required'
    )
  }

  try {
    const response = await checkoutClient.orderForm(
      orderFormId ?? checkoutOrderFormId
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

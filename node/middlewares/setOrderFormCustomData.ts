import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/custom-data-1#setsinglecustomfieldvalue-1
 */
export async function setOrderFormCustomData(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, appId, field, value } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!appId) {
    throw new UserInputError('appId is required')
  }

  if (!field) {
    throw new UserInputError('field is required')
  }

  try {
    const response = await checkoutClient.setOrderFormCustomData(
      orderFormId,
      appId,
      field,
      value
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

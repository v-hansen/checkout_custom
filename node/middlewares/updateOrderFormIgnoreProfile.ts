import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/shopping-cart#ignoreprofiledata
 */
export async function updateOrderFormIgnoreProfile(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, ignoreProfileData } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!ignoreProfileData) {
    throw new UserInputError('ignoreProfileData is required')
  }

  try {
    const response = await checkoutClient.updateOrderFormIgnoreProfile(
      orderFormId,
      ignoreProfileData
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

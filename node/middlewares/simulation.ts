import { json } from 'co-body'
import { UserInputError } from '@vtex/api'

const buildSimulationData = (
  orderForm: OrderForm,
  countryCode: string,
  postalCode: string
): SimulationPayload => {
  return {
    country: countryCode,
    items: orderForm.items.map((item: OrderFormItem) => ({
      id: item.id,
      quantity: item.quantity,
      seller: item.seller,
    })),
    postalCode,
    shippingData: orderForm.shippingData,
  }
}

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/shopping-cart#cartsimulation
 */
export async function simulation(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
  } = ctx

  const { orderFormId, countryCode, postalCode } = await json(ctx.req)

  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  if (!countryCode) {
    throw new UserInputError('countryCode is required')
  }

  if (!postalCode) {
    throw new UserInputError('postalCode is required')
  }

  try {
    const currentOrderForm = await checkoutClient.orderForm(orderFormId)
    const _simulation = buildSimulationData(
      currentOrderForm,
      countryCode,
      postalCode
    )

    const response = await checkoutClient.simulation(_simulation)

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

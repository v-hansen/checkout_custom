import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/fulfillment#getaddressbypostalcode
 */
export async function getAddress(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
    vtex: { route },
  } = ctx

  const { countryCode, postalCode } = route.params

  if (!countryCode) {
    throw new UserInputError('A countryCode was not provided')
  }

  if (!postalCode) {
    throw new UserInputError('A postalCode was not provided')
  }

  try {
    const response = await checkoutClient.getAddress(
      `${countryCode}`,
      `${postalCode}`
    )

    ctx.status = 200
    ctx.body = {
      address: response,
    }

    await next()
  } catch (error) {
    console.log('## error.response.data', error.response.data)
    throw new Error(error)
  }
}

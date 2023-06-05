import { UserInputError } from '@vtex/api'

/**
 * @link https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#getclientprofilebyemail
 */
export async function getProfile(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { checkout: checkoutClient },
    query: { email },
  } = ctx

  if (!email) {
    throw new UserInputError('An email is required')
  }

  try {
    const response = await checkoutClient.getProfile(email)

    ctx.status = 200
    ctx.body = {
      profile: response,
    }

    await next()
  } catch (error) {
    console.log('## error.response.data', error.response.data)
    throw new Error(error)
  }
}

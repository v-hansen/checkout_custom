export const queries = {
  checkoutOrder: async (
    _: unknown,
    args: { orderFormId: string },
    ctx: any
  ): Promise<any> => {
    const { clients, vtex } = ctx
    const { orderFormId = vtex.orderFormId } = args
    const data = await clients.checkout.orderForm(orderFormId ?? undefined)

    return data
  },
}

import './globals'
import type { ParamsContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import {
  errorHandler,
  addItem,
  cancelOrder,
  setOrderFormCustomData,
  updateItems,
  updateOrderFormIgnoreProfile,
  updateOrderFormPayment,
  updateOrderFormProfile,
  updateOrderFormShipping,
  getProfile,
  getAddress,
  simulation,
  updateOrderFormMarketingData,
  updateOrderFormClientPreferencesData,
  updateOrderFormCheckin,
  orderForm,
  orderFormRaw,
  newOrderForm,
  changeToAnonymousUser,
} from './middlewares'
import { resolvers } from './resolvers'
import { schemaDirectives } from './directives'

const THIRTY_SECONDS_MS = 30 * 1000

// Segments are small and immutable.
const MAX_SEGMENT_CACHE = 10000
const segmentCache = new LRUCache<string, any>({ max: MAX_SEGMENT_CACHE })
const catalogCache = new LRUCache<string, any>({ max: 3000 })
const messagesCache = new LRUCache<string, any>({ max: 3000 })

metrics.trackCache('segment', segmentCache)
metrics.trackCache('catalog', catalogCache)
metrics.trackCache('messages', messagesCache)

export default new Service<Clients, RecorderState, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      checkout: {
        concurrency: 10,
        timeout: THIRTY_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers,
    schemaDirectives,
  },
  routes: {
    addItem: method({
      POST: [errorHandler, addItem],
    }),
    cancelOrder: method({
      POST: [errorHandler, cancelOrder],
    }),
    setOrderFormCustomData: method({
      PUT: [errorHandler, setOrderFormCustomData],
    }),
    updateItems: method({
      POST: [errorHandler, updateItems],
    }),
    updateOrderFormIgnoreProfile: method({
      PATCH: [errorHandler, updateOrderFormIgnoreProfile],
    }),
    updateOrderFormPayment: method({
      POST: [errorHandler, updateOrderFormPayment],
    }),
    profile: method({
      GET: [errorHandler, getProfile],
      POST: [errorHandler, updateOrderFormProfile],
    }),
    updateOrderFormShipping: method({
      POST: [errorHandler, updateOrderFormShipping],
    }),
    address: method({
      GET: [errorHandler, getAddress],
    }),
    simulation: method({
      POST: [errorHandler, simulation],
    }),
    updateOrderFormMarketingData: method({
      POST: [errorHandler, updateOrderFormMarketingData],
    }),
    updateOrderFormClientPreferencesData: method({
      POST: [errorHandler, updateOrderFormClientPreferencesData],
    }),
    updateOrderFormCheckin: method({
      POST: [errorHandler, updateOrderFormCheckin],
    }),
    orderForm: method({
      POST: [errorHandler, orderForm],
    }),
    orderFormRaw: method({
      POST: [errorHandler, orderFormRaw],
    }),
    newOrderForm: method({
      POST: [errorHandler, newOrderForm],
    }),
    changeToAnonymousUser: method({
      POST: [errorHandler, changeToAnonymousUser],
    }),
  },
})

const getScheduledWindow = (intl: any, scheduled: DeliveryWindow) => {
  return scheduled.startDateUtc && scheduled.endDateUtc
    ? {
        date: intl.formatDate(scheduled.startDateUtc, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        startDate: intl.formatTime(scheduled.startDateUtc, {
          timeZone: 'UTC',
        }),
        endDate: intl.formatTime(scheduled.endDateUtc, {
          timeZone: 'UTC',
        }),
      }
    : {
        date: null,
        startDate: null,
        endDate: null,
      }
}

export function getEstimateTranslation(intl: any, scheduled: DeliveryWindow) {
  if (scheduled) {
    const { date, startDate, endDate } = getScheduledWindow(intl, scheduled)
    const hasDeliveryWindow = !!(startDate && endDate)
    const translatedEstimate = hasDeliveryWindow
      ? intl.formatMessage(
          {
            id: 'checkout-io.shippingEstimate-scheduled',
          },
          { date, startDate, endDate }
        )
      : intl.formatMessage({
          id: 'checkout-io.shippingEstimate-scheduled-no-dates',
        })

    return translatedEstimate
  }

  return null
}

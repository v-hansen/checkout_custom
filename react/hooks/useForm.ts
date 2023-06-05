import { useState } from 'react'

export const useForm = <T>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState as T)

  const reset = (newFormState = initialState) => setValues(newFormState)

  const getValue = (target: HTMLInputElement) => {
    if (target?.type === 'checkbox') {
      return target?.checked
    }

    return target?.value
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setValues({
      ...values,
      [event?.target.name]: getValue(event.target),
    })
  }

  return [values, handleInputChange, reset] as const
}

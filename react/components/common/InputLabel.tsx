import React from 'react'

const InputLabel = ({
  name,
  isRequired,
}: {
  name: string
  isRequired: boolean
}) => {
  return (
    <>
      {name}
      {isRequired ? <sup className="c-danger">*</sup> : null}
    </>
  )
}

export default InputLabel

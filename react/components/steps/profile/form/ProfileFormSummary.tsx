import React from 'react'

const ProfileFormSummary = ({
  firstName,
  lastName,
  phone,
}: Partial<ClientProfile>) => {
  return (
    <>
      {(firstName || lastName) && (
        <div className="flex flex-column flex-row-ns mt4">
          {`${firstName ?? ''} ${lastName ?? ''}`}
        </div>
      )}
      {phone && <div className="flex flex-column flex-row-ns mt4">{phone}</div>}
    </>
  )
}

export default ProfileFormSummary

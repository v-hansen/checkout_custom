import React from 'react'

const GiftCard = () => (
  <svg
    className="h-100 w-auto"
    width="128"
    height="80"
    viewBox="0 0 128 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="80" rx="8" fill="#E3E4E6" />
    <rect x="32" width="4" height="80" fill="#CACBCC" />
    <rect
      y="36"
      width="3.99999"
      height="128"
      transform="rotate(-90 0 36)"
      fill="#CACBCC"
    />
    <circle cx="28" cy="28" r="6" stroke="#3F3F40" strokeWidth="4" />
    <circle cx="40" cy="28" r="6" stroke="#3F3F40" strokeWidth="4" />
    <rect
      x="33.9414"
      y="31"
      width="4"
      height="16"
      rx="2"
      transform="rotate(45 33.9414 31)"
      fill="#3F3F40"
    />
    <rect
      x="31"
      y="33.8284"
      width="4"
      height="16"
      rx="2"
      transform="rotate(-45 31 33.8284)"
      fill="#3F3F40"
    />
  </svg>
)

export default GiftCard

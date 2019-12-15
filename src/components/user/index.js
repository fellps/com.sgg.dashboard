import React from 'react'

export default function User ({ avatar, name }) {
  return (
    <div className='media align-items-center'>
      <span className='avatar avatar-sm rounded-circle'>
        <img alt='avatar' src={avatar || `//joeschmoe.io/api/v1/${name}`} />
      </span>
      <div className='media-body ml-2 d-none d-lg-block'>
        <span className='mb-0 text-sm  font-weight-bold'>{name}</span>
      </div>
    </div>
  )
}

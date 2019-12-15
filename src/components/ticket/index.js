import React from 'react'

export default function Ticket ({ eventName, ticketName, userName, code }) {
  return (
    <div className='ticket'>
      <div className='cardWrap'>
        <div className='cardTicket cardLeft'>
          <h1>{eventName}</h1>
          <div className='title'>
            <h2>{ticketName}</h2>
            <span>ingresso</span>
          </div>
          <div className='name'>
            <h2>{userName}</h2>
            <span>nome</span>
          </div>
        </div>
        <div className='cardTicket cardRight'>
          <div className='eye' />
          <div className='number'>
            <h3>{code}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

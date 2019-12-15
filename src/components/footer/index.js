import React from 'react'

export default function Footer () {
  return (
    <footer className='footer'>
      <div className='row align-items-center justify-content-xl-between'>
        <div className='col-xl-6'>
          <div className='copyright text-center text-xl-left text-muted'>
            © {(new Date()).getFullYear()} <span className='font-weight-bold ml-1' target='_blank'>{process.env.REACT_APP_WEBSITE_NAME}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

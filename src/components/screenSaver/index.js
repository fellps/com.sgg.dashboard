import React from 'react'

import { Navbar, Container } from 'react-bootstrap'

export default function ScreenSaver ({ children, footer }) {
  return (
    <div className='bg-dark'>
      <div className='main-content' style={{ minHeight: '100vh' }}>
        <Navbar bg='transparent' variant='dark' expand='md' className='navbar-top navbar-horizontal'>
          <Container className='px-4'>
            <img alt='logo' src={require('../../assets/logo.png')} width='250px' />
          </Container>
        </Navbar>
        <div className='header bg-gradient-indigo py-7 py-lg-8'>
          <div className='container'>
            <div className='header-body text-center mb-7'>
              <div className='row justify-content-center'>
                <div className='col-lg-5 col-md-6'>
                  <h1 className='text-white'>Bem vindo(a)!</h1>
                  <p className='text-lead text-light'>Faça seu login para administrar os seus eventos!</p>
                </div>
              </div>
            </div>
          </div>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg x={0} y={0} viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polygon className='fill-dark' points='2560 0 2560 100 0 100' />
            </svg>
          </div>
        </div>
        {/* Page content */}
        <div className='container mt--8 pb-5'>
          <div className='row justify-content-center'>
            <div className='col-lg-5 col-md-7'>
              <div className='card bg-secondary shadow border-0'>
                <div className='card-body px-lg-5 py-lg-5'>
                  {children}
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col-6'>
                  {footer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

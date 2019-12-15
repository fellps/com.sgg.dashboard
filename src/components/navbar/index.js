import React from 'react'

import {
  Navbar,
  Nav,
  Container
} from 'react-bootstrap'

import { NavLink } from 'react-router-dom'

import { routes } from '../../routes'

export default function NavBar () {
  return (
    <Navbar
      className='navbar-vertical'
      expand='md'
      fixed='left'
      bg='white'
    >
      <Container fluid>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Brand className='pt-0' href='#home'>
          <img alt='logo' src={require('../../assets/logo-black.png')} />
        </Navbar.Brand>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav as='ul'>
            {routes.filter(r => !!r.menu).map(route => (
              <Nav.Item key={`navbar-${route.path}`} as='li'>
                <Nav.Link to={route.path} as={NavLink} activeClassName='active'>
                  {route.icon && <i className={`ni ni-${route.icon}`} />}
                  {route.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

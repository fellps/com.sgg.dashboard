import React from 'react'

import useMount from '../../helpers/useMount'

import cookies from 'js-cookie'

import { useDispatch, useSelector } from 'react-redux'

import { setLoggedUser } from './actions'

import NavBar from '../../components/navbar'
import Footer from '../../components/footer'
import User from '../../components/user'

import { Link } from 'react-router-dom'

import Helmet from 'react-helmet'

import {
  Container,
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap'

import isEmpty from 'lodash/isEmpty'

function useStateAndDispatch () {
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.dashboard.loggedUser)

  return {
    loggedUser,
    setLoggedUser: params => dispatch(setLoggedUser(params))
  }
}

export default function Dashboard ({ title, header, children, hideMenu }) {
  const { setLoggedUser, loggedUser } = useStateAndDispatch()

  useMount(() => {
    if (!isEmpty(loggedUser)) return void (0)
    if (hideMenu) return void (0)

    const loggedUserCookie = cookies.get('loggedUser')

    if (!loggedUserCookie) {
      window.location.href = '/login'
    } else {
      try {
        setLoggedUser(JSON.parse(loggedUserCookie))
      } catch (err) {
        window.location.href = '/login'
      }
    }
  })

  const logout = () => {
    cookies.remove('loggedUser')
    window.location.href = '/login'
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{title || ''}{title ? ` - ${process.env.REACT_APP_WEBSITE_NAME}` : process.env.REACT_APP_WEBSITE_NAME}</title>
      </Helmet>
      { !hideMenu && <NavBar /> }
      <div className='main-content'>
        <Navbar variant='dark' expand='lg' className='navbar-top'>
          <Container fluid>
            <Link className='h4 mb-0 text-white text-uppercase d-none d-lg-inline-block' to='#/'>
              {title}
            </Link>
            {
              !hideMenu &&
              <Nav as='ul' className='navbar-nav align-items-center mr-3 d-none d-md-flex ml-lg-auto'>
                <NavDropdown
                  className='user-info'
                  title={<User name={loggedUser.name} />}
                  id='dd-user'
                >
                  <NavDropdown.Item to={`/users/${loggedUser._id}`} as={Link}>Meu Perfil</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Sair</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            }
          </Container>
        </Navbar>
        <div className='header bg-gradient-indigo pb-8 pt-5 pt-md-8'>
          <Container fluid>
            <div className='header-body'>
              {header}
            </div>
          </Container>
        </div>
        <Container className='mt--7' fluid>
          {children}
          <Footer />
        </Container>
      </div>
    </React.Fragment>
  )
}

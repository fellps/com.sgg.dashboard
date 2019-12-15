import React from 'react'

import { Link } from 'react-router-dom'

import ScreenSaver from '../../components/screenSaver'

import Form from 'react-nonconformist'

import { connect } from 'react-redux'

import { set, login as loginAction } from './actions'

import TextInput from '../../components/inputs/text'
import PasswordInput from '../../components/inputs/password'

import cookie from 'js-cookie'
import Alert from '../../components/alert'
import Button from '../../components/button'

import Helmet from 'react-helmet'

function Login ({ data, set, login, isLoading, response, history }) {
  const submit = async () => {
    const { value: { data: loggedUser } } = await login(data)
    console.log(JSON.stringify(loggedUser))
    cookie.set('loggedUser', JSON.stringify(loggedUser.data))
    history.push('/home')
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Login - {process.env.REACT_APP_WEBSITE_NAME}</title>
      </Helmet>
      <ScreenSaver
        footer={
          <React.Fragment>
            <Link to='/forgot-password' className='text-light'>
              <small>Esqueceu a senha?</small>
            </Link>
          </React.Fragment>
        }
      >
        <div className='text-center text-muted mb-4'>
          <small>Para começar faça o login... {response.error}</small>
        </div>
        <Alert show={response.error === true}>
          {response.message}
        </Alert>
        <Form
          values={data}
          onChange={set}
          onSubmit={submit}
        >
          {(connect, submit, isValid) => (
            <form onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}>
              <TextInput
                {...connect('email')}
                required
                alternative
                placeholder={'Seu email...'}
                prepend={<i className='ni ni-single-02' />}
              />
              <PasswordInput
                {...connect('password')}
                required
                alternative
                prepend={<i className='ni ni-lock-circle-open' />}
              />
              <div className='text-center'>
                <Button
                  type='submit'
                  isLoading={isLoading}
                  disabled={!isValid}
                  className='my-4'
                >Entrar</Button>
              </div>
            </form>
          )}
        </Form>
      </ScreenSaver>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  data: state.login.data,
  response: state.login.response,
  isLoading: state.isLoading[loginAction]
})

const mapDispatchToProps = dispatch => ({
  set: params => dispatch(set(params)),
  login: params => dispatch(loginAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

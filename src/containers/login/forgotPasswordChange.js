import React from 'react'

import TextInput from '../../components/inputs/text'
import PasswordInput from '../../components/inputs/password'

import ScreenSaver from '../../components/screenSaver'

import Form from 'react-nonconformist'

import { connect } from 'react-redux'

import { setForgotPassword, forgotPassword, updatePassword } from './actions'

import Alert from '../../components/alert'
import Button from '../../components/button'

import Helmet from 'react-helmet'

function ForgotPassword ({ updatePassword, data, set, isLoading, response, history }) {
  const submit = async () => {
    await updatePassword(data)
    history.push('/login')
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Esqueci a senha - {process.env.REACT_APP_WEBSITE_NAME}</title>
      </Helmet>
      <ScreenSaver>
        <div className='text-center text-muted mb-4'>
          <small>Insira o CPF vinculado a sua conta...</small>
        </div>
        <small>Será enviado Código de Validação para o email e telefone cadastrados</small>
        <br /><br />
        <Alert
          show={response.status !== null}
          variant={response.status === 'error' ? 'danger' : 'info'}
        >
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
                label='Código'
                required
                {...connect('codigo')}
              />
              <PasswordInput
                label='Nova senha'
                required
                {...connect('senha')}
              />
              <div className='text-center'>
                <Button
                  type='submit'
                  isLoading={isLoading}
                  disabled={!isValid}
                  variant='primary'
                  className='my-4'
                >Alterar senha</Button>
              </div>
            </form>
          )}
        </Form>
      </ScreenSaver>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  data: state.login.forgotPassword,
  response: state.login.forgotPasswordResponse,
  isLoading: state.isLoading[forgotPassword]
})

const mapDispatchToProps = dispatch => ({
  set: params => dispatch(setForgotPassword(params)),
  updatePassword: params => dispatch(updatePassword(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

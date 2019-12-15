import React from 'react'

import ScreenSaver from '../../components/screenSaver'

import Form from 'react-nonconformist'

import { connect } from 'react-redux'

import { setForgotPassword, forgotPassword } from './actions'

import CPFInput from '../../components/inputs/cpf'

import Alert from '../../components/alert'
import Button from '../../components/button'

import Helmet from 'react-helmet'

function ForgotPassword ({
  data,
  set,
  forgotPassword,
  isLoading,
  response,
  history
}) {
  const submit = async () => {
    await forgotPassword(data)
    history.push('/forgot-password/change')
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
        <Alert show={response.status === 'error'}>
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
              <CPFInput
                {...connect('cpf')}
                required
                alternative
                prepend={<i className='ni ni-single-02' />}
              />
              <div className='text-center'>
                <Button
                  type='submit'
                  isLoading={isLoading}
                  disabled={!isValid}
                  className='my-4'
                >Enviar Código</Button>
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
  forgotPassword: params => dispatch(forgotPassword(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

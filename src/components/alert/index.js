import React from 'react'

import { Alert as AlertRB, Button } from 'react-bootstrap'

export default function Alert ({ show, variant = 'danger', header, children, onOk }) {
  return (
    <AlertRB
      show={show}
      variant={variant}
    >
      {header && <AlertRB.Heading>{header}</AlertRB.Heading>}
      {children}
      {onOk && (
        <React.Fragment>
          <hr />
          <div className='d-flex justify-content-end'>
            <Button onClick={onOk}>
              Fechar
            </Button>
          </div>
        </React.Fragment>
      )}
    </AlertRB>
  )
}

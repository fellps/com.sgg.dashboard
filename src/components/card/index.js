import React from 'react'

import {
  Card as CardRB,
  Row,
  Col
} from  'react-bootstrap'

import ReactLoading from 'react-loading'

import classname from 'classname'

export const Loading = () => (
  <div
    style={{
      backgroundColor: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%'
    }}
  >
    <ReactLoading
      type='spin'
      color='#000'
      height={40}
      width={40}
    />
  </div>
)

export default function Card ({ header, isLoading, actions, children, shadow, noBody }) {
  return (
    <CardRB className={classname({ shadow })}>
      {(header || actions) && (
        <CardRB.Header>
          <Row>
            <Col>
              {header}
            </Col>
            <Col className='text-right'>{actions}</Col>
          </Row>
        </CardRB.Header>
      )}
      {!noBody ? (
        <CardRB.Body style={{ position: 'relative' }}>
          {children}
          {isLoading && <Loading />}
        </CardRB.Body>
      ) : (
        <div style={{ position: 'relative' }}>
          {children}
          {isLoading && <Loading />}
        </div>
      )}
    </CardRB>
  )
}

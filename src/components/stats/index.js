import React from 'react'

import { Card, Row, Col } from 'react-bootstrap'

export default function Stats ({ title, values = [], up, down, icon = 'fa-chart-pie' }) {
  return (
    <Card className='card-stats mb-4 mb-xl-0'>
      <Card.Body>
        <Row>
          <Col>
            <h5 className='card-title text-uppercase text-muted mb-0'>{title}</h5>
            {values[0] != null && <div className='h2 font-weight-bold mb-0'>{values[0]}</div>}
            {values[1] != null && <div className='h3 mb-0'>{values[1]}</div>}
          </Col>
          <Col className='col-auto'>
            <div className='icon icon-shape bg-warning text-white rounded-circle shadow'>
              <i className={`fas ${icon}`} />
            </div>
          </Col>
        </Row>
        {(up || down) && (
          <p className='mt-3 mb-0 text-muted text-sm'>
            {up && <span className='text-success mr-2'><i className='fa fa-arrow-up' /> {up}</span>}
            {down && <span className='text-danger mr-2'><i className='fa fa-arrow-down' /> {down}</span>}
          </p>
        )}
      </Card.Body>
    </Card>
  )
}

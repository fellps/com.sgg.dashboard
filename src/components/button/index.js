import React from  'react'

import { Button as ButtonRB } from 'react-bootstrap'

import { Link } from  'react-router-dom'

import ReactLoading from 'react-loading'

import classname from 'classname'

export default function Button ({ children, to, isLoading, disabled, icon, className, variant='dark', ...restProps }) {
  return <ButtonRB
    {...restProps}
    variant={variant}
    {...(to && { as: Link, to })}
    className={`${className || ''} ${classname({ 'btn-icon': icon })}`}
    disabled={isLoading || disabled}
  >
    {isLoading ? (
      <ReactLoading
        type='spin'
        color={String(variant).includes('outline') ? '#333' : '#fff'}
        height={20}
        width={20}
        disabled
      />
    ) : icon ? (
      <React.Fragment>
        <span className='btn-inner--icon'>
          <i className={`ni ni-${icon}`} />
        </span>
        {children && <span className='btn-inner--text'>{children}</span>}
      </React.Fragment>
    ) : (
      children
    )}
  </ButtonRB>
}

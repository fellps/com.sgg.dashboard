import React from 'react'

import { Pagination as PaginationRB } from 'react-bootstrap'

import mem from 'mem'

const paginate = mem(function pagination (c, m) {
  const current = c
  const last = m
  const delta = 2
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

export default function Pagination ({
  activePage,
  itemsCountPerPage,
  totalItemsCount,
  onChange
}) {
  const lastPage = Math.ceil(totalItemsCount / itemsCountPerPage)

  const pagination = paginate(activePage, lastPage)

  // console.log(itemsCountPerPage, totalItemsCount, lastPage, pagination)

  pagination.pop()
  pagination.shift()

  return (
    <PaginationRB>
      {activePage !== 1 && <PaginationRB.First onClick={() => onChange(1)} />}
      {pagination.map((page, i) => {
        if (page === '...') {
          return (
            <PaginationRB.Ellipsis
              key={`elipsis-${i}`}
              onClick={() => onChange(i + 1)}
            />
          )
        }

        return (
          <PaginationRB.Item
            key={`item-${i}`}
            onClick={() => onChange(page)}
          >{page}</PaginationRB.Item>
        )
      })}
      {activePage !== lastPage && <PaginationRB.Last onClick={() => onChange(1)} />}
    </PaginationRB>
  )
}

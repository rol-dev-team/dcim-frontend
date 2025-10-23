import React from 'react'
import { Link } from 'react-router-dom'

export const AddButtonComponent = ({to}) => {
  return (
    <Link to={to} className='add-btn'>Add</Link>
  )
}

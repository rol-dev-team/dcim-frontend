import React from 'react'

export const CardComponent = ({title,inputFields}) => {
  return (
    <div class="card w-100">
  <h5 class="card-header">{title}</h5>
  <div class="card-body">
    {inputFields}
  </div>
</div>
  )
}

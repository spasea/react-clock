import React from 'react'

const Hand = ({ image, isSmall = false }) =>
  <div className={`hand ${isSmall ? 'hand--is-small' : ''}`}>
    <img src={image} alt="hand"/>
  </div>

export default Hand

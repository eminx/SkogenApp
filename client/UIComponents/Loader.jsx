import React from 'react'
import { PulseLoader } from 'react-spinners'

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: 24
}

const Loader = () => (
  <div style={loaderStyle}>
    <PulseLoader color='#ff4d83' loading />
  </div>
)

export default Loader

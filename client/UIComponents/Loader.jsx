import React from 'react';
import { Spin } from 'antd';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: 24,
};

const Loader = () => (
  <div style={loaderStyle}>
    <Spin />
  </div>
);

export default Loader;

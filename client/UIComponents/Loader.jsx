import React from 'react';
import { Spin } from 'antd';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: 24,
};

function Loader({ isContainer = false, ...otherProps }) {
  if (!isContainer) {
    return (
      <div style={loaderStyle}>
        <Spin {...otherProps} />
      </div>
    );
  }

  return <Spin wrapperClassName="spin-container" {...otherProps} />;
}

export default Loader;

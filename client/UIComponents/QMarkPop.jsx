import React from 'react';
import { Popover } from 'antd';

const popoverStyle = { maxWidth: 280, fontSize: 14, lineHeight: 1.3 };

function QMarkPop({ children }) {
  return (
    <div style={{ marginLeft: 10, marginTop: 6, cursor: 'pointer' }}>
      <Popover content={<div style={popoverStyle}>{children}</div>}>
        <img width={24} height={24} src="../../images/QuestionMark.svg" />
      </Popover>
    </div>
  );
}

export default QMarkPop;

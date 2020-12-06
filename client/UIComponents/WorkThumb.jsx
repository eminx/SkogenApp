import React from 'react';
import { Avatar, Card, Icon, Tag } from 'antd/lib';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const { Meta } = Card;

const commonStyle = {
  color: '#fff',
  fontWeight: 300,
  lineHeight: 1
};
const imageStyle = {
  width: 288,
  height: 288,
  objectFit: 'cover'
};

const ellipsisStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

function WorkThumb({ work, history }) {
  return (
    <div className="thumb-cover-container">
      <div className="thumb-cover">
        <LazyLoadImage
          alt={work.title}
          src={work.images[0]}
          style={imageStyle}
          effect="black-and-white"
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 16
        }}
      >
        {work.category ? (
          <Tag
            color={work.category.color}
            style={{ zIndex: 2, borderRadius: 0 }}
          >
            <b>{work.category.label.toUpperCase()}</b>
          </Tag>
        ) : (
          <div />
        )}
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      </div>

      <div style={{ position: 'relative', padding: '24px 16px' }}>
        <h4
          style={{
            ...commonStyle,
            fontSize: 18,
            marginBottom: 6,
            lineHeight: '24px',
            overflowWrap: 'anywhere'
          }}
        >
          {work.title}
        </h4>
        <p
          style={{
            ...commonStyle,
            fontSize: 16,
            lineHeight: '18px',
            fontStyle: 'italic'
          }}
        >
          {work.subtitle}
        </p>
      </div>
    </div>
  );
}

export default WorkThumb;

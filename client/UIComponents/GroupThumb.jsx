import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

const yesterday = moment(new Date()).add(-1, 'days');

const dateStyle = {
  color: '#fff',
  fontWeight: 700,
  lineHeight: 1,
};

const commonStyle = {
  color: '#fff',
  fontWeight: 300,
  lineHeight: 1,
};

const imageStyle = {
  width: '100%',
  height: 288,
  objectFit: 'cover',
};

const coverClass = 'thumb-cover';
const coverContainerClass = 'thumb-cover-container ';

function ThumbDate({ date }) {
  if (!date) {
    return null;
  }

  const isPastEvent = !moment(date.startDate).isAfter(yesterday);

  if (isPastEvent) {
    dateStyle.color = '#aaa';
  } else {
    dateStyle.color = '#fff';
  }

  return (
    <div style={{ marginRight: 16, marginBottom: 16 }}>
      <div style={{ ...dateStyle, fontSize: 24 }}>
        {moment(date.startDate).format('DD')}
      </div>
      <div style={{ ...dateStyle, fontSize: 15 }}>
        {moment(date.startDate).format('MMM').toUpperCase()}
      </div>
    </div>
  );
}

function GroupThumb({ item }) {
  const futureDates = item.meetings.filter((date) =>
    moment(date.startDate).isAfter(yesterday)
  );
  const remaining = futureDates.length - 3;
  const clickLink = `/group/${item._id}`;

  return (
    <div className={coverContainerClass}>
      <Link to={clickLink}>
        <div className={coverClass}>
          <LazyLoadImage
            alt={item.title}
            src={item.imageUrl}
            style={imageStyle}
            effect="black-and-white"
            wrapperClassName="thumb-cover-child-lazy-image"
          />
        </div>

        <div style={{ position: 'relative', padding: '24px 16px' }}>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
          >
            {futureDates.slice(0, 3).map((date) => (
              <ThumbDate key={date.startDate + date.startTime} date={date} />
            ))}
            {remaining > 0 && (
              <div style={{ ...dateStyle, fontSize: 20, marginBottom: 16 }}>
                + {remaining}
              </div>
            )}
          </div>
          <h3
            style={{
              ...commonStyle,
              fontSize: 24,
              marginBottom: 6,
              lineHeight: '32px',
              overflowWrap: 'anywhere',
            }}
          >
            {item.isGroup ? item.title : item.title}
          </h3>
          <h4 style={{ ...commonStyle, fontSize: 16, lineHeight: '21px' }}>
            {item.isGroup ? item.readingMaterial : item.subTitle}
          </h4>
        </div>
      </Link>
    </div>
  );
}

export default GroupThumb;

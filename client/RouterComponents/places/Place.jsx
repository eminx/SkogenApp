import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';
import { Carousel, Col, Image, Row, Tag, message } from 'antd';
import MediaQuery from 'react-responsive';

import Loader from '../../UIComponents/Loader';
import { call } from '../../functions';

const sliderSettings = {
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

const noCapitalsHeader = {
  textTransform: 'none',
};

function Place({ history, match }) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = Meteor.user();

  useEffect(() => {
    getPlace();
  }, []);

  const getPlace = async () => {
    const { id } = match.params;

    try {
      const response = await call('getPlace', id);
      setPlace(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  if (!place || loading) {
    return <Loader />;
  }

  const author =
    place.authorFirstName && place.authorLastName
      ? place.authorFirstName + ' ' + place.authorLastName
      : place.authorUsername;

  const isSuperAdmin = currentUser && currentUser.isSuperAdmin;

  return (
    <Row gutter={12}>
      <Col lg={6}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ padding: 12, flexGrow: 1 }}>
            <h2 style={{ marginBottom: 0 }}>{place.title}</h2>
            {place.category && place.category.label !== 'uncategorised' && (
              <Tag
                style={{ borderRadius: 0, marginBottom: 12 }}
                value={place.category.label}
                color={place.category.color}
              >
                <b>{place.category.label}</b>
              </Tag>
            )}
            <p style={{ ...noCapitalsHeader }}>{place.shortDescription}</p>
          </div>
        </div>
      </Col>
      <Col lg={12}>
        <div
          style={{
            padding: '0 36px',
            backgroundColor: 'rgba(0,0,0, 0.85)',
          }}
        >
          <Carousel {...sliderSettings}>
            {place &&
              place.images &&
              place.images.map((image) => (
                <div
                  key={image}
                  style={{
                    height: 320,
                    margin: '0 auto',
                  }}
                >
                  <Image
                    alt={place.title}
                    src={image}
                    style={{ margin: '0 auto', objectFit: 'contain' }}
                  />
                </div>
              ))}
          </Carousel>
        </div>
        <div style={{ padding: 12, marginBottom: 24, marginTop: 12 }}>
          <div>
            {place.longDescription && renderHTML(place.longDescription)}{' '}
          </div>
        </div>

        <MediaQuery query="(min-width: 991px)">
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 12 }}
          >
            {isSuperAdmin && <Link to={`/edit-place/${place._id}`}>Edit</Link>}
          </div>
        </MediaQuery>
      </Col>

      <Col lg={6}>
        <MediaQuery query="(min-width: 992px)">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 12,
            }}
          >
            <h4 style={{ flexGrow: 1, marginLeft: 12, marginTop: 24 }}>
              {place.additionalInfo}
            </h4>
          </div>
        </MediaQuery>

        <MediaQuery query="(max-width: 991px)">
          <h4 style={{ textAlign: 'center', marginBottom: 24 }}>
            {place.additionalInfo}
          </h4>
          {isSuperAdmin && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Link to={`/edit-place/${place._id}`}>Edit</Link>
            </div>
          )}
        </MediaQuery>
      </Col>
    </Row>
  );
}

export default Place;

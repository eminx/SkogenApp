import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';
import { Avatar, Col, Row, Tag, message } from 'antd';
import Slider from 'react-slick';
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

function Work({ history, match }) {
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = Meteor.user();

  useEffect(() => {
    getWork();
  }, []);

  const getWork = async () => {
    const { id, username } = match.params;

    try {
      const response = await call('getWork', id, username);
      setWork(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  if (!work || loading) {
    return <Loader />;
  }

  const author =
    work.authorFirstName && work.authorLastName
      ? work.authorFirstName + ' ' + work.authorLastName
      : work.authorUsername;

  const isOwner = currentUser && currentUser.username === match.params.username;

  return (
    <Row gutter={12}>
      <Col lg={6}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ padding: 12, flexGrow: 1 }}>
            <h2 style={{ marginBottom: 0 }}>{work.title}</h2>
            {work.category && (
              <Tag
                style={{ borderRadius: 0, marginBottom: 12 }}
                value={work.category.label}
                color={work.category.color}
              >
                <b>{work.category.label}</b>
              </Tag>
            )}
            <p style={{ ...noCapitalsHeader }}>{work.shortDescription}</p>
          </div>
          <MediaQuery query="(max-width: 991px)">
            <div style={{ flexGrow: 0, paddingTop: 12 }}>
              <AvatarHolder work={work} />
            </div>
          </MediaQuery>
        </div>
      </Col>
      <Col lg={12}>
        <div
          style={{
            padding: '0 36px',
            backgroundColor: 'rgba(0,0,0, 0.85)',
          }}
        >
          <Slider {...sliderSettings}>
            {work &&
              work.images &&
              work.images.map((image) => (
                <div
                  key={image}
                  style={{
                    height: 380,
                    margin: '0 auto',
                  }}
                >
                  <img
                    alt={work.title}
                    src={image}
                    style={{ margin: '0 auto', objectFit: 'contain' }}
                  />
                </div>
              ))}
          </Slider>
        </div>
        <div style={{ padding: 12, marginBottom: 24, marginTop: 12 }}>
          <div>{work.longDescription && renderHTML(work.longDescription)} </div>
        </div>

        <MediaQuery query="(min-width: 991px)">
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 12 }}
          >
            {isOwner && (
              <Link to={`/${currentUser.username}/edit-work/${work._id}`}>
                Edit
              </Link>
            )}
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
              {work.additionalInfo}
            </h4>
            <Link to={`/${work.authorUsername}`}>
              <AvatarHolder work={work} />
            </Link>
          </div>
        </MediaQuery>

        <MediaQuery query="(max-width: 991px)">
          <h4 style={{ textAlign: 'center', marginBottom: 24 }}>
            {work.additionalInfo}
          </h4>
          {isOwner && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Link to={`/${currentUser.username}/edit-work/${work._id}`}>
                Edit
              </Link>
            </div>
          )}
        </MediaQuery>
      </Col>
    </Row>
  );
}

function AvatarHolder({ work }) {
  if (!work) {
    return null;
  }

  const initials =
    work.authorUsername && work.authorUsername.substring(0, 1).toUpperCase();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 0,
        marginRight: 12,
        color: 'rgba(0,0,0,.85)',
        ...noCapitalsHeader,
      }}
    >
      <Avatar
        size={60}
        src={work.authorAvatar && work.authorAvatar.src}
        style={{ backgroundColor: '#921bef' }}
      >
        {initials}
      </Avatar>
      <b>{work.authorUsername}</b>
    </div>
  );
}

export default Work;

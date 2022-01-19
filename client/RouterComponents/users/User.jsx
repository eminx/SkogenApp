import React, { useState } from 'react';
import renderHTML from 'react-render-html';
import MediaQuery from 'react-responsive';

import {
  Affix,
  Alert,
  Avatar,
  Carousel,
  Col,
  Divider,
  Space,
  Row,
  Typography,
} from 'antd';
import Loader from '../../UIComponents/Loader';

const { Text, Title, Paragraph } = Typography;

const getFullName = (user) => {
  const { firstName, lastName } = user;
  if (firstName && lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName || lastName || '';
  }
};

function User({ user }) {
  // const [affixContainer, setAffixContainer] = useState(null);

  if (!user) {
    return (
      <Alert
        message="There's no user associated with this handle, or the user chose not to publish their profile"
        type="error"
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Loader isContainer spinning={!user}>
        <Row gutter={24}>
          <Col md={8}>
            <Space align="center">
              <Avatar
                shape="square"
                size={80}
                src={user.avatar && user.avatar.src}
              >
                {user.username[0].toLowerCase()}
              </Avatar>
              <div style={{ paddingLeft: 12 }}>
                <Title
                  level={4}
                  style={{ textTransform: 'lowercase', marginTop: 24 }}
                >
                  {user.username}
                </Title>
                <Text strong>{getFullName(user)}</Text>
              </div>
            </Space>

            <MediaQuery query="(max-width: 767px)">
              <ImageSlider user={user} />
            </MediaQuery>

            <div
              style={{
                margin: '24px 0',
              }}
            >
              <InfoSection title="Skogen & Me" info={user.skogenAndMe} />
              <InfoSection
                title="What I can contribute to the community"
                info={user.forCommunity}
              />
              <InfoSection title="I'm interested in" info={user.interestedIn} />
              <InfoSection title="Contact info" info={user.contactInfo} />
            </div>
          </Col>

          <Col md={16}>
            <MediaQuery query="(min-width: 768px)">
              {/* <Affix offsetTop={50} target={() => affixContainer}> */}
              <ImageSlider user={user} height={500} />
              {/* </Affix> */}
            </MediaQuery>
          </Col>
        </Row>
      </Loader>
    </div>
  );
}

function ImageSlider({ user, height = 300 }) {
  if (!user || !user.images || user.images.length === 0) {
    return null;
  }

  return (
    <Carousel
      autoplay
      autoplaySpeed={3000}
      effect="fade"
      style={{ marginTop: 12 }}
    >
      {user.images &&
        user.images.length > 0 &&
        user.images.map((image) => (
          <div
            key={image}
            style={{
              height: height,
              margin: '0 auto',
            }}
          >
            <img src={image} style={{ margin: '0 auto', height: height }} />
          </div>
        ))}
    </Carousel>
  );
}

function InfoSection({ info, title }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title italic level={5}>
        {title}
      </Title>
      {info && <Paragraph>{renderHTML(info)}</Paragraph>}
      <Divider />
    </div>
  );
}

export default User;

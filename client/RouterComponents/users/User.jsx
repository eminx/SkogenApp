import React from 'react';
import renderHTML from 'react-render-html';

import { Avatar, Row, Col, message, Divider, Typography, Space } from 'antd';
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

function User({ user, userWorks }) {
  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: 24 }}>
      <Loader isContainer spinning={!user}>
        <Row>
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

            <Divider />
            <InfoSection title="Skogen & Me" info={user.skogenAndMe} />
            <InfoSection
              title="What I can contribute to the community"
              info={user.forCommunity}
            />
            <InfoSection title="I'm interested in" info={user.interestedIn} />
            <InfoSection title="Contact info" info={user.contactInfo} />
          </Col>

          <Col md={16}></Col>
        </Row>
      </Loader>
    </div>
  );
}

function InfoSection({ info, title }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title italic level={5}>
        {title}
      </Title>
      {info && (
        <Paragraph style={{ maxWidth: 480 }}>{renderHTML(info)}</Paragraph>
      )}
      <Divider />
    </div>
  );
}

export default User;

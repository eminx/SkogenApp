import React from 'react';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';

import { Avatar, Row, Col, message, Divider, Typography, Space } from 'antd';
import Loader from '../../UIComponents/Loader';
import WorkThumb from '../../UIComponents/WorkThumb';

const { Text, Title, Paragraph } = Typography;

const getFullName = (user) => {
  const { firstName, lastName } = user;
  if (firstName && lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName || lastName || '';
  }
};

function User({ user, userWorks, currentUser, isLoading }) {
  if (!user) {
    return null;
  }

  return (
    <div>
      <Row gutter={36} style={{ padding: 24 }}>
        <Col lg={8}>
          <Space direction="vertical" align="center">
            <Avatar
              src={user.avatar && user.avatar.src}
              size={80}
              // onClick={avatarExists ? () => setAvatarModal(true) : null}
              // style={{ cursor: avatarExists ? 'pointer' : 'default' }}
            >
              {user.username[0]}
            </Avatar>
            <Title
              level={4}
              style={{ textAlign: 'center', textTransform: 'lowercase' }}
            >
              {user.username}
            </Title>
            <Text strong style={{ textAlign: 'center' }}>
              {getFullName(user)}
            </Text>

            {user.bio && (
              <Paragraph margin={{ top: 'small' }}>
                {renderHTML(user.bio)}
              </Paragraph>
            )}

            {/* <Link onClick={onOpen} as="button" margin={{ top: 'medium' }}>
              Contact
            </Link> */}
          </Space>
        </Col>

        <Col lg={16}>
          {userWorks &&
            userWorks.length > 0 &&
            userWorks.map((work) => (
              <div key={work._id} style={{ margin: 12 }}>
                <Link to={`/${work.authorUsername}/work/${work._id}`}>
                  <WorkThumb work={work} />
                </Link>
              </div>
            ))}
        </Col>
      </Row>
    </div>
  );
}

export default User;

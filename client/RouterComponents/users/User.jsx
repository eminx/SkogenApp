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
      <Loader isContainer spinning={!user}>
        <Row gutter={36} style={{ padding: 24 }}>
          <Col lg={8}>
            <Space align="center">
              <Avatar
                src={user.avatar && user.avatar.src}
                size={80}
                // onClick={avatarExists ? () => setAvatarModal(true) : null}
                // style={{ cursor: avatarExists ? 'pointer' : 'default' }}
              >
                {user.username[0]}
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
            {user.bio && (
              <Paragraph margin={{ top: 'small' }}>
                {renderHTML(user.bio)}
              </Paragraph>
            )}

            {/* <Link onClick={onOpen} as="button" margin={{ top: 'medium' }}>
              Contact
            </Link> */}
          </Col>

          <Col lg={16}>
            <Space align="center">
              {userWorks &&
                userWorks.length > 0 &&
                userWorks.map((work) => (
                  <div key={work._id} style={{ margin: 12 }}>
                    <Link to={`/${work.authorUsername}/work/${work._id}`}>
                      <WorkThumb work={work} />
                    </Link>
                  </div>
                ))}
            </Space>
          </Col>
        </Row>
      </Loader>
    </div>
  );
}

export default User;

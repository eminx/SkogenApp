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

function User({ user, userWorks }) {
  if (!user) {
    return null;
  }

  const noWork = !userWorks || userWorks.length === 0;
  const workOnlyOne = userWorks && userWorks.length === 1;

  return (
    <div>
      <Loader isContainer spinning={!user}>
        <Row gutter={36} style={{ padding: 24 }}>
          <Col lg={noWork ? 24 : workOnlyOne ? 12 : 8} md={24} sm={24}>
            <Row justify="center">
              <Space align="center">
                <Avatar
                  src={user.avatar && user.avatar.src}
                  size={80}
                  // onClick={avatarExists ? () => setAvatarModal(true) : null}
                  // style={{ cursor: avatarExists ? 'pointer' : 'default' }}
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
            </Row>
            <Divider />
            <Row justify="center">
              {user.bio && (
                <Paragraph style={{ maxWidth: 480 }}>
                  {renderHTML(user.bio)}
                </Paragraph>
              )}
            </Row>

            {/* <Link onClick={onOpen} as="button" margin={{ top: 'medium' }}>
              Contact
            </Link> */}
          </Col>

          <Col lg={noWork ? 0 : workOnlyOne ? 12 : 16} md={24} sm={24}>
            <Row justify="center" style={{}}>
              <Space align="center">
                {!noWork &&
                  userWorks.map((work) => (
                    <div key={work._id} style={{ margin: 12 }}>
                      <Link to={`/${work.authorUsername}/work/${work._id}`}>
                        <WorkThumb work={work} />
                      </Link>
                    </div>
                  ))}
              </Space>
            </Row>
          </Col>
        </Row>
      </Loader>
    </div>
  );
}

export default User;

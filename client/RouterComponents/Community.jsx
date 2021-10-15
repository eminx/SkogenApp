import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Cascader, Divider, Typography, message } from 'antd/lib';
import renderHTML from 'react-render-html';

import Loader from '../UIComponents/Loader';
import { call } from '../functions';

const { Paragraph, Text, Title } = Typography;

function Community(props) {
  const [keywords, setKeywords] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [publicProfiles, setPublicProfiles] = useState([]);

  useEffect(() => {
    getKeywords();
    getPublicProfiles();
  }, []);

  const getKeywords = async () => {
    try {
      const allKeywords = await call('getKeywords');
      setKeywords(
        allKeywords.sort((a, b) => {
          return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        })
      );
    } catch (error) {
      message.error(error.error);
    }
  };

  const getPublicProfiles = async () => {
    try {
      const profiles = await call('getPublicProfiles');
      setPublicProfiles(profiles);
    } catch (error) {
      message.error(error.error);
    }
  };

  const getProfile = async (username) => {
    if (!username) {
      return;
    }
    try {
      const profile = await call('getPublicProfile', username);
      setSelectedProfile({
        ...profile,
      });
    } catch (error) {
      message.error(error.error);
    }
  };

  const onChange = (value, selectedOptions) => {
    const username = value[1];
    setSelectedProfile({
      username,
    });
    getProfile(username);
  };

  const cascaderOptions = keywords.map((k) => ({
    value: k.value,
    label: k.value,
    children: k.assignedTo.map((c) => ({
      value: c.username,
      label: c.username,
    })),
  }));

  const dropdownRender = (menus) => {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          {menus}
          <Divider type="vertical" />
          {selectedProfile ? (
            <div style={{ maxWidth: 350 }}>
              <div
                style={{
                  display: 'flex',
                  marginBottom: 24,
                }}
              >
                {selectedProfile.avatar && (
                  <Avatar
                    shape="square"
                    size={80}
                    src={
                      selectedProfile.avatar ? selectedProfile.avatar.src : null
                    }
                    style={{ marginRight: 24 }}
                  />
                )}
                <div>
                  <Title level={3}>{selectedProfile.username}</Title>
                  {selectedProfile.firstName && selectedProfile.lastName && (
                    <Text strong style={{ marginBottom: 24 }}>
                      {selectedProfile.firstName +
                        ' ' +
                        selectedProfile.lastName}
                    </Text>
                  )}
                </div>
              </div>
              {selectedProfile.forCommunity && (
                <Paragraph italic>
                  {renderHTML(selectedProfile.forCommunity)}
                </Paragraph>
              )}
              <div style={{ marginBottom: 24 }}>
                For more info, go to the{' '}
                <Link to={`/${selectedProfile.username}`}>profile page</Link>.
              </div>

              {selectedProfile.contactInfo && (
                <div>
                  <Title level={5}>Contact Info</Title>
                  <Paragraph>
                    {renderHTML(selectedProfile.contactInfo)}
                  </Paragraph>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', padding: 24 }}>
          {publicProfiles.map(
            (p) =>
              p.avatar && (
                <Link to={`/${p.username}`}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 12,
                    }}
                  >
                    <Avatar shape="square" size={80} src={p.avatar.src} />
                    <Title level={5}>{p.username}</Title>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="community-page" style={{ minHeight: '100vh' }}>
      <Loader isContainer spinning={!cascaderOptions}>
        <Title level={3}>Select Keywords</Title>
        <Cascader
          bordered={false}
          dropdownClassName="dropdown-class"
          dropdownRender={dropdownRender}
          open
          options={cascaderOptions}
          size="large"
          style={{
            visibility: 'hidden',
          }}
          onChange={onChange}
        />
      </Loader>
    </div>
  );
}

export default Community;

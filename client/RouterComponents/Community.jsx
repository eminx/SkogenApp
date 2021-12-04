import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cascader,
  Divider,
  Row,
  Tabs,
  Typography,
  message,
} from 'antd/lib';
import renderHTML from 'react-render-html';

import Loader from '../UIComponents/Loader';
import { call } from '../functions';

const { Paragraph, Text, Title } = Typography;
const { TabPane } = Tabs;

function Community(props) {
  const [keywords, setKeywords] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

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
    if (typeof username !== 'string') {
      return;
    }
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
    if (activeTab !== '2') {
      return;
    }
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxHeight: 280,
            overflow: 'scroll',
            padding: 12,
            backgroundColor: '#e5ffe9',
          }}
        >
          {menus}
        </div>
        <Divider type="vertical" />
        {selectedProfile ? (
          <div
            style={{
              maxWidth: 380,
              maxHeight: 480,
              overflow: 'scroll',
              padding: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                marginBottom: 24,
              }}
            >
              {selectedProfile.avatar && (
                <Link to={`/@${selectedProfile.username}`}>
                  <Avatar
                    shape="square"
                    size={80}
                    src={
                      selectedProfile.avatar ? selectedProfile.avatar.src : null
                    }
                    style={{ marginRight: 24 }}
                  />
                </Link>
              )}
              <div>
                <Link to={`/@${selectedProfile.username}`}>
                  <Title level={3}>{selectedProfile.username}</Title>
                </Link>
                {selectedProfile.firstName && selectedProfile.lastName && (
                  <Text strong style={{ marginBottom: 24 }}>
                    {selectedProfile.firstName + ' ' + selectedProfile.lastName}
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
              <Link to={`/@${selectedProfile.username}`}>profile page</Link>.
            </div>

            {selectedProfile.contactInfo && (
              <div>
                <Title level={5}>Contact Info</Title>
                <Paragraph>{renderHTML(selectedProfile.contactInfo)}</Paragraph>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const filter = (inputValue, path) => {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  const handleTabSelect = (key, event) => {
    if (key === activeTab) {
      return;
    }
    setSelectedProfile(null);
    setActiveTab(key);
  };

  return (
    <div className="community-page" style={{ minHeight: '200vh' }}>
      <Loader isContainer spinning={!cascaderOptions}>
        <Tabs centered onTabClick={handleTabSelect}>
          <TabPane tab="See People" key="1">
            <Row justify="center">
              {publicProfiles.map(
                (p) =>
                  p.avatar && (
                    <Link to={`/@${p.username}`}>
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
            </Row>
          </TabPane>
          <TabPane tab="Find People" key="2">
            {activeTab === '2' && (
              <Row justify="space-between">
                <Cascader
                  autoFocus
                  dropdownRender={dropdownRender}
                  open={activeTab === '2'}
                  options={cascaderOptions}
                  placeholder="Type/Select Keywords..."
                  size="large"
                  showSearch={{ filter }}
                  style={{
                    backgroundColor: '#401159',
                    width: 304,
                  }}
                  onChange={onChange}
                />
              </Row>
            )}
          </TabPane>
        </Tabs>
      </Loader>
    </div>
  );
}

export default Community;

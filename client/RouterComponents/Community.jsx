import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parse, stringify } from 'query-string';
import {
  Avatar,
  Cascader,
  Divider,
  Modal,
  Radio,
  Row,
  Typography,
  message,
} from 'antd/lib';
import renderHTML from 'react-render-html';

import Loader from '../UIComponents/Loader';
import QMarkPop from '../UIComponents/QMarkPop';
import { call } from '../functions';

const RadioGroup = Radio.Group;
const { Paragraph, Text, Title } = Typography;

const helperText =
  'Here you find people connected to Skogen and discover what they are interested in. If you want to connect to Skogen, make your profile page by logging in and choosing to make your profile public.';

function Community({ history }) {
  const [cascaderColumns, setCascaderColumns] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const {
    location: { search },
  } = history;
  const { showFind } = parse(search, { parseBooleans: true });

  useEffect(() => {
    getKeywords();
    getPublicProfiles();
  }, []);

  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const isMobile = screenWidth < 911;

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

  const handleCascaderSelect = (value, selectedOptions) => {
    setCascaderColumns(value.length);
    const username = value[1];
    if (username) {
      getProfile(username);
    } else {
      setSelectedProfile(null);
    }
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <div>{menus}</div>
        <Divider type="vertical" />
        {selectedProfile && !isMobile && (
          <div
            style={{
              maxWidth: 380,
              maxHeight: 480,
              overflow: 'scroll',
              padding: 12,
              paddingTop: 0,
            }}
          >
            <ProfileView profile={selectedProfile} />
          </div>
        )}
      </div>
    );
  };

  const filter = (inputValue, path) => {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  const handleTabSelect = ({ target: { value } }) => {
    const showFind = value === 'Find People';
    history.push({ search: stringify({ showFind }) });

    if (value === showFind) {
      return;
    }
    setSelectedProfile(null);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="community-page" style={{ minHeight: '200vh' }}>
      <Loader
        isContainer
        spinning={!publicProfiles || publicProfiles.length < 1}
      >
        <Row justify="center">
          <QMarkPop>{helperText}</QMarkPop>
        </Row>

        <Row justify="center" style={{ margin: 12 }}>
          <RadioGroup
            value={showFind ? 'Find People' : 'See People'}
            options={['See People', 'Find People']}
            onChange={handleTabSelect}
            optionType="button"
            buttonStyle="solid"
          />
        </Row>

        {showFind ? (
          <Row justify="space-between">
            <Cascader
              changeOnSelect
              dropdownClassName={`cascader-container cascader-container-${
                cascaderColumns > 0 ? '-collapsed' : '-open'
              }`}
              dropdownRender={dropdownRender}
              open
              options={cascaderOptions}
              placeholder="Type/Select Keywords..."
              showSearch={{ filter }}
              size="large"
              style={{
                backgroundColor: '#401159',
                width: 280,
              }}
              onChange={handleCascaderSelect}
            />
          </Row>
        ) : (
          <Row justify="center">
            {publicProfiles.map(
              (p) =>
                p.avatar && (
                  <Link key={p.username} to={`/@${p.username}`}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 12,
                        maxWidth: 140,
                      }}
                    >
                      <Avatar
                        shape="square"
                        size={120}
                        src={p.avatar.src}
                        style={{ border: '1px solid #921bef' }}
                      />
                      <Title
                        className="avatar-ellipsis"
                        level={5}
                        style={{ textAlign: 'center' }}
                      >
                        {p.username}
                      </Title>
                    </div>
                  </Link>
                )
            )}
          </Row>
        )}

        {isMobile && (
          <Modal
            okText="See Full Profile"
            style={{ top: 0, bottom: 0 }}
            visible={Boolean(selectedProfile)}
            onOk={() => history.push(`/@${selectedProfile.username}`)}
            onCancel={() => closeModal()}
          >
            <ProfileView profile={selectedProfile} />
          </Modal>
        )}
      </Loader>
    </div>
  );
}

function ProfileView({ profile }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          marginBottom: 24,
        }}
      >
        {profile.avatar && (
          <Link to={`/@${profile.username}`}>
            <Avatar
              shape="square"
              size={80}
              src={profile.avatar ? profile.avatar.src : null}
              style={{ marginRight: 24 }}
            />
          </Link>
        )}
        <div>
          <Link to={`/@${profile.username}`}>
            <Title level={3}>{profile.username}</Title>
          </Link>
          {profile.firstName && profile.lastName && (
            <Text strong style={{ marginBottom: 24 }}>
              {profile.firstName + ' ' + profile.lastName}
            </Text>
          )}
        </div>
      </div>
      {profile.forCommunity && (
        <Paragraph italic>{renderHTML(profile.forCommunity)}</Paragraph>
      )}
      <div style={{ marginBottom: 24 }}>
        For more info, go to the{' '}
        <Link to={`/@${profile.username}`}>profile page</Link>.
      </div>

      {profile.contactInfo && (
        <div>
          <Title level={5}>Contact Info</Title>
          <Paragraph>{renderHTML(profile.contactInfo)}</Paragraph>
        </div>
      )}
    </div>
  );
}

export default Community;

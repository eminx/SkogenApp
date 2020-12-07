import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';
import { Col, Row, Tag } from 'antd/lib';
import Slider from 'react-slick';

import Loader from '../../UIComponents/Loader';

const sliderSettings = { dots: true };

const noCapitalsHeader = {
  textTransform: 'none'
};

const Work = ({ history, match, work, isLoading, currentUser }) => {
  if (!work || isLoading) {
    return <Loader />;
  }

  const author =
    work.authorFirstName && work.authorLastName
      ? work.authorFirstName + ' ' + work.authorLastName
      : work.authorUsername;

  const isOwner = currentUser && currentUser.username === match.params.username;

  // const AvatarHolder = props => (
  //   <Link to={`/@${work.authorUsername}`}>
  //     <Box alignSelf="end" align="center" {...props}>
  //       <Box>
  //         <Avatar
  //           elevation="medium"
  //           src={work.authorAvatar && work.authorAvatar.src}
  //         />
  //       </Box>
  //       <Anchor href={`/@${work.authorUsername}`}>
  //         <Text size="small">{work.authorUsername}</Text>
  //       </Anchor>
  //     </Box>
  //   </Link>
  // );

  return (
    <Row gutter={12}>
      <Col lg={6}>
        <div style={{ padding: 12 }}>
          {work.category && (
            <Tag
              style={{ borderRadius: 0, marginBottom: 12 }}
              value={work.category.label}
              color={work.category.color}
            >
              <b>{work.category.label.toUpperCase()}</b>
            </Tag>
          )}
          <h2 style={{ marginBottom: 0 }}>{work.title}</h2>
          <p style={{ ...noCapitalsHeader }}>{work.subtitle}</p>
        </div>
      </Col>
      <Col lg={12}>
        <Slider settings={sliderSettings}>
          {work &&
            work.images &&
            work.images.map(image => (
              <img key={image} alt={work.title} src={image} />
            ))}
        </Slider>

        <div style={{ padding: 12, marginBottom: 24 }}>
          <div>{work.description && renderHTML(work.description)} </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          {isOwner && (
            <Link
              to={`/${currentUser.username}/edit-work/${match.params.workId}`}
            >
              Edit this Work
            </Link>
          )}
        </div>
      </Col>

      <Col
        lg={6}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 12
        }}
      >
        <h4 style={{ flexGrow: 1, marginLeft: 12, ...noCapitalsHeader }}>
          {work.additionalInfo}
        </h4>
        <div
          style={{
            flexGrow: 0,
            marginRight: 12,
            color: 'rgba(0,0,0,.85)',
            ...noCapitalsHeader
          }}
        >
          <b>{work.authorUsername}</b>
        </div>
      </Col>
    </Row>
  );
};

export default withTracker(({ history, match }) => {
  const { id, username } = match.params;
  const workSubscription = Meteor.subscribe('work', id, username);
  const work = Works ? Works.findOne(id) : null;
  const isLoading = !workSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    work,
    history,
    match
  };
})(Work);

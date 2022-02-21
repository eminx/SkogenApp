import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Divider, Card, Button } from 'antd';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';

import Loader from '../../UIComponents/Loader';

class Publication extends React.PureComponent {
  state = {
    modalOpen: false,
    redirectToLogin: false,
  };

  isAdmin = () => {
    const { currentUser, publication } = this.props;
    if (!currentUser || !publication) {
      return false;
    }

    const isAdmin = publication && publication.adminId === currentUser._id;

    return Boolean(isAdmin);
  };

  getTitle = (publication) => {
    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>{publication.title}</h2>
        <h4 style={{ fontWeight: 300 }}>
          <em>{publication.authors}</em>
        </h4>
      </div>
    );
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to="/my-profile" />;
    }

    const { publication, isLoading, currentUser } = this.props;

    const isAdmin = this.isAdmin();

    return (
      <div>
        <div style={{ padding: 12 }}>
          <Link to="/publications">
            <Button icon={<LeftOutlined />}>Publications</Button>
          </Link>
        </div>

        {!isLoading && publication ? (
          <Row gutter={24} style={{ paddingRight: 12, paddingLeft: 12 }}>
            <Col sm={24} md={12}>
              <Card
                bordered
                style={{ width: '100%', marginBottom: 0 }}
                cover={
                  publication.imageUrl ? (
                    <img alt="publication-image" src={publication.imageUrl} />
                  ) : null
                }
                bodyStyle={{ display: 'none' }}
              />
            </Col>
            <Col sm={24} md={12} style={{ position: 'relative', padding: 24 }}>
              {this.getTitle(publication)}
              <b>{publication.format}</b>

              <br />
              <div style={{ whiteSpace: 'pre-line' }}>
                <p>
                  {publication.purchaseInfo} <br />{' '}
                  <a href={publication.linkToDigitalCopy} target="_blank">
                    Download
                  </a>
                </p>
                <p>{publication.description}</p>
              </div>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}
        <Divider />
        {publication && isAdmin && (
          <Row justify="center">
            <Link to={`/edit-publication/${publication._id}`}>
              <Button>Edit</Button>
            </Link>
          </Row>
        )}
        <Divider />
      </div>
    );
  }
}

export default Publication;

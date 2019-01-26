import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Radio, Button, Divider, Card } from 'antd/lib';
import PagesList from '../../UIComponents/PagesList';

import { parseTitle } from '../../functions';

class Page extends React.Component {
  render() {
    const { pages, pageId, currentUser, isLoading, history } = this.props;
    const pageTitles = pages ? pages.map(page => page.title) : [];
    const page =
      pages && pages.length > 0
        ? pages.find(page => parseTitle(page.title) === parseTitle(pageId))
        : null;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={8}>
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={pageId}
            />

            {currentUser && currentUser.isSuperAdmin && (
              <div style={{ marginLeft: 24 }}>
                <Link to="/new-page" key="new-page">
                  <Button type="primary">New Page</Button>
                </Link>
              </div>
            )}
          </Col>

          <Col md={12}>
            <div
              style={{
                marginBottom: 24
              }}
            >
              <h3>{page && page.title}</h3>
              <div style={{ whiteSpace: 'pre-line' }}>
                {page && page.longDescription}
              </div>
            </div>
          </Col>
          <Col md={4}>
            {page && currentUser && currentUser.isSuperAdmin && (
              <Link to={`/edit-page/${parseTitle(page.title)}`}>
                {' '}
                <Button>Edit</Button>
              </Link>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Page;

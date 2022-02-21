import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Divider, Tabs } from 'antd';
import renderHTML from 'react-render-html';

import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

import { parseTitle } from '../../functions';

const { TabPane } = Tabs;

class Page extends PureComponent {
  render() {
    const { pages, pageId, currentUser, isLoading, history } = this.props;
    const pageTitles = pages ? pages.map((page) => page.title) : [];
    const page =
      pages && pages.length > 0
        ? pages.find((page) => parseTitle(page.title) === parseTitle(pageId))
        : null;

    return (
      <div style={{ padding: 24 }}>
        <Loader isContainer spinning={isLoading}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={8}>
              {currentUser && currentUser.isSuperAdmin && (
                <div style={{ marginBottom: 12 }}>
                  <Link to="/new-page" key="new-page">
                    <Button type="primary">New Page</Button>
                  </Link>
                </div>
              )}
              <PagesList
                pageTitles={pageTitles}
                activePageTitle={pageId}
                history={history}
              />
            </Col>

            <Col md={10}>
              <div
                style={{
                  marginBottom: 24,
                  width: '100%',
                }}
              >
                <h2>{page && page.title}</h2>
                {page &&
                  (page.longDescriptionSV ? (
                    <Tabs type="line" animated={false}>
                      <TabPane tab="English" key="1">
                        <div style={{ color: '#401159' }}>
                          {page && renderHTML(page.longDescription)}
                        </div>
                      </TabPane>
                      {page && page.longDescriptionSV && (
                        <TabPane tab="Svenska" key="2">
                          <div style={{ color: '#401159' }}>
                            {renderHTML(page.longDescriptionSV)}
                          </div>
                        </TabPane>
                      )}
                    </Tabs>
                  ) : (
                    <div style={{ color: '#401159' }}>
                      {renderHTML(page.longDescription)}
                    </div>
                  ))}
              </div>
            </Col>
          </Row>
          {page && currentUser && currentUser.isSuperAdmin && (
            <Row justify="center">
              <Divider />
              <Link to={`/edit-page/${parseTitle(page.title)}`}>
                {' '}
                <Button>Edit</Button>
              </Link>
              <Divider />
            </Row>
          )}
        </Loader>
      </div>
    );
  }
}

export default Page;

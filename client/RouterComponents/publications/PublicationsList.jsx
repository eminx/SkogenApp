import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, List, Card, Radio, Button, Divider } from 'antd/lib';
import Loader from '../../UIComponents/Loader';

const ListItem = List.Item;
const { Meta } = Card;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

function shortenDescription(str) {
  return str
    .split(/\s+/)
    .slice(0, 20)
    .join(' ');
}

const compareByPublishDate = (a, b) => {
  const dateA = new Date(a.publishDate);
  const dateB = new Date(b.publishDate);
  return dateB - dateA;
};

class PublicationsList extends React.PureComponent {
  state = {
    filterType: 'all'
  };

  getTitle = publication => {
    return (
      <div>
        <h3>
          <Link to={`/publication/${publication._id}`}>
            {publication.title}
          </Link>
        </h3>
        <h5>
          by: <b>{publication.authors}</b>
        </h5>
      </div>
    );
  };

  getExtra = publication => {
    return (
      <div>
        <b>{publication.format}</b>
        <br />
        <span style={{ fontSize: 10 }}>
          published: {moment(publication.publishDate).format('Do MMM YYYY')}
        </span>
      </div>
    );
  };

  handleFilter = event => {
    this.setState({
      filterType: event.target.value
    });
  };

  render() {
    const { isLoading, currentUser, publicationsData } = this.props;
    const { filterType } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const publicationsSorted = publicationsData.sort(compareByPublishDate);

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      padding: 24,
      paddingBottom: 0
    };

    const publicationTypesRepeated = publicationsData.map(pub => pub.format);
    const publicationTypes = ['all', ...new Set(publicationTypesRepeated)];

    const publicationsFiltered =
      filterType === 'all'
        ? publicationsSorted
        : publicationsSorted.filter(pub => pub.format === filterType);

    return (
      <Row gutter={24}>
        <Col md={8}>
          {currentUser && currentUser.isRegisteredMember && (
            <div style={centerStyle}>
              <Link to="/new-publication">
                <Button type="primary" component="span">
                  New Publication
                </Button>
              </Link>
            </div>
          )}
        </Col>

        <Col md={14} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Publications</h2>

          <div style={centerStyle}>
            <RadioGroup
              options={publicationTypes}
              onChange={this.handleFilter}
              value={filterType}
              style={{ marginBottom: 12 }}
            />
          </div>

          <List
            dataSource={publicationsFiltered}
            renderItem={publication => (
              <ListItem style={{ paddingBottom: 0 }}>
                <Card
                  title={this.getTitle(publication)}
                  bordered
                  extra={this.getExtra(publication)}
                  style={{ width: '100%', marginBottom: 0 }}
                  className="empty-card-body"
                />
              </ListItem>
            )}
          />
        </Col>

        <Col md={16} />
      </Row>
    );
  }
}

export default PublicationsList;

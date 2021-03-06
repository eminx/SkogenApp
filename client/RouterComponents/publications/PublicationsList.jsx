import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { List, Card, Radio, Button } from 'antd';

const ListItem = List.Item;
const RadioGroup = Radio.Group;

import Loader from '../../UIComponents/Loader';
import SexyThumb from '../../UIComponents/SexyThumb';

const compareByPublishDate = (a, b) => {
  const dateA = new Date(a.publishDate);
  const dateB = new Date(b.publishDate);
  return dateB - dateA;
};

class PublicationsList extends React.PureComponent {
  state = {
    filterType: 'All',
  };

  getTitle = (publication) => {
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

  getExtra = (publication) => {
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

  handleFilter = (event) => {
    this.setState({
      filterType: event.target.value,
    });
  };

  render() {
    const { isLoading, currentUser, publicationsData } = this.props;
    const { filterType } = this.state;

    const publicationsSorted = publicationsData.sort(compareByPublishDate);

    const centerStyle = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: 6,
    };

    const publicationTypesRepeated = publicationsData.map((pub) => pub.format);
    const publicationTypes = ['All', ...new Set(publicationTypesRepeated)];

    const publicationsFiltered =
      filterType === 'All'
        ? publicationsSorted
        : publicationsSorted.filter((pub) => pub.format === filterType);

    return (
      <div>
        <Loader isContainer spinning={isLoading}>
          <h2 style={{ textAlign: 'center', marginTop: 12 }}>Publications</h2>
          {currentUser && currentUser.isRegisteredMember && (
            <div style={centerStyle}>
              <Link to="/new-publication">
                <Button component="span">New Publication</Button>
              </Link>
            </div>
          )}

          <div style={centerStyle}>
            <RadioGroup
              options={publicationTypes}
              onChange={this.handleFilter}
              value={filterType}
              optionType="button"
              buttonStyle="solid"
              style={{ marginBottom: 12 }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {publicationsFiltered &&
              publicationsFiltered.length > 0 &&
              publicationsFiltered.map((pub) => (
                <SexyThumb key={pub._id} item={pub} isPub />
              ))}
          </div>
        </Loader>
      </div>
    );
  }
}

export default PublicationsList;

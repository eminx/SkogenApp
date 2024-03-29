import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Radio, Row, message } from 'antd';
import moment from 'moment';

import Loader from '../../UIComponents/Loader';
import SexyThumb from '../../UIComponents/SexyThumb';
import QMarkPop from '../../UIComponents/QMarkPop';
import { call, compareForSort } from '../../functions';

const RadioGroup = Radio.Group;

const yesterday = moment().add(-1, 'days');

const getFirstFutureOccurence = (occurence) => {
  return occurence && moment(occurence.startDate).isAfter(yesterday);
};

const compareForSortFuture = (a, b) => {
  const firstOccurenceA = a.meetings.find(getFirstFutureOccurence);
  const firstOccurenceB = b.meetings.find(getFirstFutureOccurence);
  const dateA = new Date(
    firstOccurenceA &&
      firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB &&
      firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};

function getSortedGroups(groups) {
  const groupsWithFutureMeetings = [];
  const groupsWithoutFutureMeetings = [];

  groups.forEach((group) => {
    const meetings = group.meetings;
    if (
      meetings &&
      meetings.length > 0 &&
      moment(meetings[meetings.length - 1].startDate).isAfter(yesterday)
    ) {
      groupsWithFutureMeetings.push(group);
    } else {
      groupsWithoutFutureMeetings.push(group);
    }
  });

  return [
    ...groupsWithFutureMeetings.sort(compareForSortFuture),
    ...groupsWithoutFutureMeetings.sort(compareForSort),
  ];
}

const centerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 12,
};

const groupFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'My Groups',
    value: 'my-groups',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

const helperText =
  'Here you can join a group of interest and check out their dates of getting together. Sign up to a group to receive updates and information. You can suggest a new group yourself by mailing us.';

class GroupsList extends PureComponent {
  state = {
    filterOption: 'active',
    groups: [],
    loading: true,
  };

  componentDidMount() {
    this.getGroups();
  }

  getGroups = async () => {
    try {
      const groups = await call('getGroups');
      this.setState({ groups, loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
      message.error(error.reason);
    }
  };

  getFilteredGroups = () => {
    const { currentUser } = this.props;
    const { filterOption, groups } = this.state;

    if (!groups) {
      return [];
    }
    const filteredGroups = groups.filter((group) => {
      if (filterOption === 'archived') {
        return group.isArchived === true;
      } else if (filterOption === 'my-groups') {
        return (
          group.members &&
          group.members.some((member) => member.memberId === currentUser._id)
        );
      } else {
        return !group.isArchived;
      }
    });

    return filteredGroups;
  };

  handleSelectedFilter = (e) => {
    const { currentUser } = this.props;
    const value = e.target.value;
    if (!currentUser && value === 'my-groups') {
      message.destroy();
      message.error('You need an account for filtering your groups');
      return;
    }
    this.setState({
      filterOption: value,
    });
  };

  render() {
    const { currentUser } = this.props;
    const { filterOption, loading } = this.state;

    const groupsFiltered = this.getFilteredGroups();
    const groupsFilteredAndSorted = getSortedGroups(groupsFiltered);

    return (
      <div>
        <Loader isContainer spinning={loading}>
          <div style={centerStyle}>
            {currentUser && currentUser.isRegisteredMember && (
              <Link to="/new-group">
                <Button type="primary" component="span">
                  New Group
                </Button>
              </Link>
            )}
            <QMarkPop>{helperText}</QMarkPop>
          </div>

          <div style={centerStyle}>
            <RadioGroup
              value={filterOption}
              options={groupFilterOptions}
              onChange={this.handleSelectedFilter}
              optionType="button"
              buttonStyle="solid"
            />
          </div>

          <Row style={{ marginRight: 24, marginBottom: 12 }}>
            {groupsFilteredAndSorted &&
              groupsFilteredAndSorted.length > 0 &&
              groupsFilteredAndSorted.map((group) => (
                <Col
                  key={group._id}
                  xs={24}
                  sm={12}
                  lg={8}
                  style={{ overflow: 'hidden', padding: '12px 24px' }}
                >
                  <SexyThumb item={group} />
                </Col>
              ))}
          </Row>
        </Loader>
      </div>
    );
  }
}

export default GroupsList;

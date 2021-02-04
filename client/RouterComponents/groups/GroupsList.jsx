import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Radio, Button, message } from 'antd/lib';
import Loader from '../../UIComponents/Loader';
import NiceList from '../../UIComponents/NiceList';
import SexyThumb from '../../UIComponents/SexyThumb';

const RadioGroup = Radio.Group;

import { compareForSort } from '../../functions';

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

class GroupsList extends PureComponent {
  state = {
    filterOption: 'active',
    groups: [],
    loading: true,
  };

  componentDidMount() {
    this.getGroups();
  }

  getGroups = () => {
    Meteor.call('getGroups', (error, respond) => {
      if (error) {
        message.error(error.reason);
        console.log(error);
        return;
      }
      this.setState({
        groups: respond,
        loading: false,
      });
    });
  };

  getTitle = (group) => {
    return (
      <div>
        <div>
          <h3 style={{ overflowWrap: 'anywhere' }}>
            <Link to={`/group/${group._id}`}>{group.title}</Link>
          </h3>
          <h5>
            <b>{group.readingMaterial}</b>
          </h5>
        </div>
        <div style={{ textAlign: 'right', lineHeight: '16px' }}>
          <span style={{ fontSize: 12 }}>{group.adminUsername}</span>
          <br />
          <span style={{ fontSize: 10 }}>
            {moment(group.creationDate).format('Do MMM YYYY')}
          </span>
        </div>
      </div>
    );
  };

  getExtra = (group) => {
    return (
      <div>
        {group.adminUsername}
        <br />
        <span style={{ fontSize: 10 }}>
          {moment(group.creationDate).format('Do MMM YYYY')}
        </span>
      </div>
    );
  };

  archiveGroup = (groupId) => {
    Meteor.call('archiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.error);
      } else {
        message.success('Group is successfully archived');
      }
    });
  };

  unarchiveGroup = (groupId) => {
    Meteor.call('unarchiveGroup', groupId, (error, respond) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success('Group is successfully unarchived');
      }
    });
  };

  getFilteredGroups = () => {
    const { currentUser } = this.props;
    const { groups, filterOption } = this.state;

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

    if (loading) {
      return <Loader />;
    }

    const groupsFilteredAndSorted = this.getFilteredGroups().sort(
      compareForSort
    );

    const centerStyle = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: 6,
    };

    const groupsList = groupsFilteredAndSorted.map((group) => ({
      ...group,
      actions: [
        {
          content: group.isArchived ? 'Unarchive' : 'Archive',
          handleClick: group.isArchived
            ? () => this.unarchiveGroup(group._id)
            : () => this.archiveGroup(group._id),
          isDisabled:
            !currentUser ||
            (group.adminId !== currentUser._id && !currentUser.isSuperAdmin),
        },
      ],
    }));

    return (
      <div>
        <h2 style={{ textAlign: 'center', marginTop: 12 }}>Groups</h2>

        {currentUser && currentUser.isRegisteredMember && (
          <div style={centerStyle}>
            <Link to="/new-group">
              <Button component="span">New Group</Button>
            </Link>
          </div>
        )}

        <div style={centerStyle}>
          <RadioGroup
            value={filterOption}
            options={groupFilterOptions}
            onChange={this.handleSelectedFilter}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {groupsFilteredAndSorted &&
            groupsFilteredAndSorted.length > 0 &&
            groupsFilteredAndSorted.map((group) => (
              <SexyThumb key={group._id} item={group} />
            ))}
        </div>

        {/* {groupsList && groupsList.length > 0 && (
          <NiceList
            list={groupsList.reverse()}
            actionsDisabled={!currentUser || !currentUser.isRegisteredMember}
          >
            {(group) => (
              <Card
                title={this.getTitle(group)}
                bordered={false}
                // extra={this.getExtra(group)}
                style={{ width: '100%', marginBottom: 0 }}
                className="empty-card-body"
              />
            )}
          </NiceList>
        )} */}
      </div>
    );
  }
}

export default GroupsList;

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Radio, Row, message } from 'antd';

import Loader from '../../UIComponents/Loader';
import SexyThumb from '../../UIComponents/SexyThumb';
import { call } from '../../functions';

const RadioGroup = Radio.Group;

import { compareForSort } from '../../functions';

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

    const groupsFilteredAndSorted =
      this.getFilteredGroups().sort(compareForSort);

    return (
      <div>
        <Loader isContainer spinning={loading}>
          {currentUser && currentUser.isRegisteredMember && (
            <div style={centerStyle}>
              <Link to="/new-group">
                <Button type="primary" component="span">
                  New Group
                </Button>
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

          <Row gutter={0} style={{ marginRight: 0 }}>
            {groupsFilteredAndSorted &&
              groupsFilteredAndSorted.length > 0 &&
              groupsFilteredAndSorted.map((group) => (
                <Col
                  key={group._id}
                  xs={24}
                  sm={12}
                  lg={8}
                  style={{ overflow: 'hidden', padding: '4px 8px' }}
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

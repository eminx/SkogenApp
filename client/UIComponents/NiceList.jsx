import React, { PureComponent } from 'react';
import { List } from 'antd';
const ListItem = List.Item;

import EllipsisMenu from './EllipsisMenu';

class NiceList extends PureComponent {
  render() {
    const { list, actionsDisabled, children } = this.props;

    return (
      <List
        dataSource={list}
        className="nicelist"
        renderItem={(listItem, index) => (
          <ListItem
            style={{ alignItems: 'start' }}
            actions={
              actionsDisabled
                ? []
                : [<EllipsisMenu actions={listItem.actions} />]
            }
          >
            {children(listItem)}
          </ListItem>
        )}
      />
    );
  }
}

export default NiceList;

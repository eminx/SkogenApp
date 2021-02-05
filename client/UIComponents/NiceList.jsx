import React, { PureComponent } from 'react';
import { Menu, List, Dropdown } from 'antd/lib';
import { EllipsisOutlined } from '@ant-design/icons/lib';

const MenuItem = Menu.Item;
const ListItem = List.Item;

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
                : [
                    <Dropdown
                      trigger={['click']}
                      placement="bottomRight"
                      overlay={
                        <Menu>
                          {listItem.actions.map((action) => (
                            <MenuItem key={action.content}>
                              <a
                                onClick={
                                  action.isDisabled ? null : action.handleClick
                                }
                                style={
                                  action.isDisabled
                                    ? {
                                        color: '#ccc',
                                        cursor: 'not-allowed',
                                      }
                                    : null
                                }
                              >
                                {action.content}
                              </a>
                            </MenuItem>
                          ))}
                        </Menu>
                      }
                    >
                      <div>
                        <EllipsisOutlined
                          style={{
                            fontSize: 24,
                            marginTop: 6,
                            transform: 'rotate(90deg)',
                          }}
                        />
                      </div>
                    </Dropdown>,
                  ]
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

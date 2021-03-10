import React from 'react';
import { Dropdown, Menu } from 'antd';
import EllipsisOutlined from '@ant-design/icons/lib/icons/EllipsisOutlined';
const MenuItem = Menu.Item;

function EllipsisMenu({ actions }) {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      overlay={
        <Menu>
          {actions.map((action) => (
            <MenuItem key={action.content}>
              <a
                onClick={action.isDisabled ? null : action.handleClick}
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
    </Dropdown>
  );
}

export default EllipsisMenu;

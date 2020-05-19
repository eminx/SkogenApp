import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const linkStyle = {
  textTransform: 'uppercase',
  padding: '6px 0'
};

const activeStyle = {
  fontWeight: 700
};

const adminMenu = [
  {
    label: 'Users',
    value: '/admin/users'
  },
  {
    label: 'Resources',
    value: '/admin/resources'
  },
  {
    label: 'Widgets',
    value: '/admin/widgets'
  }
];

const AdminMenu = ({ currentPath }) => {
  return (
    <div style={{ padding: 24 }}>
      {adminMenu.map((item, index) => (
        <div
          key={item.value}
          style={
            currentPath === item.value
              ? { ...activeStyle, ...linkStyle }
              : linkStyle
          }
        >
          <Link to={item.value}>{item.label}</Link>
        </div>
      ))}
    </div>
  );
};

export default AdminMenu;

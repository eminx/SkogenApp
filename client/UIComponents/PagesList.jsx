import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select } from 'antd';
const { Option } = Select;

import { parseTitle } from '../functions';
import MediaQuery from 'react-responsive';

const linkStyle = {
  padding: '6px 0',
};

function PagesList({ pageTitles, activePageTitle, history }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <Redirect to={`/page/${selected.value}`} />;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 24,
        width: '100%',
      }}
    >
      <MediaQuery query="(min-width: 768px)">
        {pageTitles.map((title, index) => (
          <Link
            key={title + index}
            className={
              parseTitle(activePageTitle) === parseTitle(title)
                ? 'menu-item active-menu-item'
                : 'menu-item'
            }
            style={linkStyle}
            to={`/page/${parseTitle(title)}`}
          >
            <b>{title}</b>
          </Link>
        ))}
      </MediaQuery>
      <MediaQuery query="(max-width: 767px)">
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Select
            defaultValue={activePageTitle}
            onChange={(value) => history.push(`/page/${value}`)}
            size="large"
            loading={!activePageTitle}
            style={{ width: '100%' }}
          >
            {pageTitles.map((title, index) => (
              <Option key={title} value={parseTitle(title)}>
                {title}
              </Option>
            ))}
          </Select>
        </div>
      </MediaQuery>
    </div>
  );
}

export default PagesList;

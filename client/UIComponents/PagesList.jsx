import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select } from 'antd/lib';
const { Option } = Select;

import { parseTitle } from '../functions';
import MediaQuery from 'react-responsive';

const activeStyle = {
  fontWeight: 700,
};

const linkStyle = {
  textTransform: 'uppercase',
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
          <div
            key={title + index}
            style={
              parseTitle(activePageTitle) === parseTitle(title)
                ? { ...activeStyle, ...linkStyle }
                : linkStyle
            }
          >
            <Link to={`/page/${parseTitle(title)}`}>{title}</Link>
          </div>
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

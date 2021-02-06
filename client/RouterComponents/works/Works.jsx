import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Tag, message } from 'antd';

import WorkThumb from '../../UIComponents/WorkThumb';
import Loader from '../../UIComponents/Loader';
import { call } from '../../functions';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    getAllWorks();
  }, []);

  const getAllWorks = async () => {
    try {
      const response = await call('getAllWorks');
      setWorks(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
      setLoading(false);
    }
  };

  if (loading || !works) {
    return <Loader />;
  }

  const sortedWorks = works.sort(compareByDate);

  const filteredWorks = categoryFilter
    ? sortedWorks.filter(
        (work) => work.category && work.category.label === categoryFilter
      )
    : sortedWorks;

  const categoriesAssignedToWorks = getCategories(works);

  return (
    <Row gutter={24}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
        <Link to="/new-work">
          <Button type="primary" component="span">
            New Work
          </Button>
        </Link>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: 12,
        }}
      >
        <Tag
          value="ALL"
          onClick={() => setCategoryFilter(null)}
          style={{ borderRadius: 0 }}
        >
          <b>ALL</b>
        </Tag>
        {categoriesAssignedToWorks.map((cat) => (
          <Tag
            key={cat.label}
            value={cat.label}
            onClick={() => setCategoryFilter(cat.label)}
            color={cat.color}
            style={{ marginBottom: 'small', zIndex: 2, borderRadius: 0 }}
          >
            <b>{cat.label && cat.label.toUpperCase()}</b>
          </Tag>
        ))}
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {filteredWorks.map((work) => (
          <div key={work._id} style={{ margin: 12 }}>
            <Link to={`/${work.authorUsername}/work/${work._id}`}>
              <WorkThumb work={work} />
            </Link>
          </div>
        ))}
      </div>
    </Row>
  );
}

getCategories = (works) => {
  const labels = Array.from(
    new Set(works.map((work) => work.category && work.category.label))
  );
  const colors = Array.from(
    new Set(works.map((work) => work.category && work.category.color))
  );
  return labels.map((label, i) => ({
    label,
    color: colors[i],
  }));
};

getOpacHSL = (color) => {
  return color ? color.substr(0, color.length - 4) + '1)' : null;
};

export default Works;

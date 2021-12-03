import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row, message } from 'antd';

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

function Places({ history, currentUser }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    getAllWorks();
  }, []);

  const getAllWorks = async () => {
    try {
      const response = await call('getAllPlaces');
      setWorks(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
      setLoading(false);
    }
  };

  const sortedWorks = works.sort(compareByDate);
  const filteredWorks = categoryFilter
    ? sortedWorks.filter(
        (work) => work.category && work.category.label === categoryFilter
      )
    : sortedWorks;

  const categoriesAssignedToWorks = getCategories(works);

  return (
    <Loader isContainer spinning={loading || !works}>
      {currentUser && currentUser.isSuperAdmin && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          <Link to="/new-place">
            <Button type="primary" component="span">
              New Place
            </Button>
          </Link>
        </div>
      )}

      <Row style={{ marginRight: 8, paddingBottom: 4 }}>
        {filteredWorks.map((work) => (
          <Col
            key={work._id}
            xs={24}
            sm={12}
            lg={8}
            style={{ overflow: 'hidden', padding: '4px 8px' }}
          >
            <Link to={`/place/${work._id}`}>
              <WorkThumb work={work} />
            </Link>
          </Col>
        ))}
      </Row>
    </Loader>
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

export default withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  return {
    currentUser,
  };
})(Places);

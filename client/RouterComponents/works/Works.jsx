import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import WorkThumb from '../../UIComponents/WorkThumb';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

function WorksList({ history, works }) {
  // const [loading, setLoading] = useState(true);
  // const [categoryFilter, setCategoryFilter] = useState(null);

  // const getAllWorks = async () => {
  //   try {
  //     const response = await call('getAllWorks');
  //     setWorks(response);
  //     setLoading(false);
  //   } catch (error) {
  //     message.error(error.reason);
  //     setLoading(false);
  //   }
  // };

  // if (loading || !works) {
  //   return <Loader />;
  // }

  // const sortedWorks = works.sort(compareByDate);

  // const filteredWorks = categoryFilter
  //   ? sortedWorks.filter(
  //       work => work.category && work.category.label === categoryFilter
  //     )
  //   : sortedWorks;

  // const categoriesAssignedToWorks = getCategories(works);

  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {works.map(work => (
        <div key={work.title} style={{ width: 280, margin: 12 }}>
          <WorkThumb work={work} />
        </div>
      ))}
    </div>
  );
}

getCategories = works => {
  const labels = Array.from(
    new Set(works.map(work => work.category && work.category.label))
  );
  const colors = Array.from(
    new Set(works.map(work => work.category && work.category.color))
  );
  return labels.map((label, i) => ({
    label,
    color: colors[i]
  }));
};

getOpacHSL = color => {
  return color ? color.substr(0, color.length - 4) + '1)' : null;
};

export default withTracker(({ history }) => {
  const worksSubscription = Meteor.subscribe('works');
  const works = Works ? Works.find().fetch() : null;
  const isLoading = !worksSubscription.ready();
  const currentUser = Meteor.user();
  return {
    isLoading,
    currentUser,
    works,
    history
  };
})(WorksList);

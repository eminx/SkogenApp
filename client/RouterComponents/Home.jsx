import React, { PureComponent, useEffect, useState } from 'react';
import { parse, stringify } from 'query-string';
import moment from 'moment';
import { Row, Radio } from 'antd';
import Loader from '../UIComponents/Loader';
import SexyThumb from '../UIComponents/SexyThumb';

const yesterday = moment().add(-1, 'days');
const today = moment();

const RadioGroup = Radio.Group;

const centerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 6,
};

const getFirstFutureOccurence = (occurence) =>
  moment(occurence.endDate).isAfter(yesterday);

const getFirstPastOccurence = (occurence) =>
  moment(occurence.endDate).isBefore(today);

const compareForSort = (a, b) => {
  const firstOccurenceA = a.datesAndTimes.find(getFirstFutureOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getFirstFutureOccurence);
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};

const compareForSortReverse = (a, b) => {
  const firstOccurenceA = a.datesAndTimes.find(getFirstPastOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getFirstPastOccurence);
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateB - dateA;
};

const parseOnlyAllowedGroups = (futureGroups, currentUserId) => {
  return futureGroups.filter((group) => {
    if (!group.isPrivate) {
      return true;
    } else {
      if (!currentUser) {
        return false;
      }
      return (
        group.adminId === currentUserId ||
        group.members.some((member) => member.memberId === currentUserId) ||
        group.peopleInvited.some(
          (person) => person.email === currentUser.emails[0].address
        )
      );
    }
  });
};

const getGroupMeetings = (groupsList, currentUser) => {
  if (!groupsList) {
    return null;
  }

  const futureGroups = groupsList.filter((group) =>
    group.meetings.some((meeting) =>
      moment(meeting.startDate).isAfter(yesterday)
    )
  );

  if (!currentUser) {
    return futureGroups.map((group) => ({
      ...group,
      datesAndTimes: group.meetings,
      isGroup: true,
    }));
  }

  const futureGroupsWithAccessFilter = parseOnlyAllowedGroups(
    futureGroups,
    currentUser._id
  );

  return futureGroupsWithAccessFilter.map((group) => ({
    ...group,
    datesAndTimes: group.meetings,
    isGroup: true,
  }));
};

const getPublicActivities = (bookingsList) => {
  if (!bookingsList) {
    return null;
  }

  const publicActivities = bookingsList.filter(
    (activity) => activity.isPublicActivity === true
  );

  return publicActivities.filter((activity) =>
    activity.datesAndTimes.some((date) =>
      moment(date.endDate).isAfter(yesterday)
    )
  );
};

const getPastPublicActivities = (bookingsList) => {
  if (!bookingsList) {
    return null;
  }

  const publicActivities = bookingsList.filter(
    (activity) => activity.isPublicActivity === true
  );

  return publicActivities.filter((activity) =>
    activity.datesAndTimes.some((date) =>
      moment(date.startDate).isBefore(today)
    )
  );
};

function Home({ history, bookingsList, groupsList, currentUser, isLoading }) {
  const [past, setPast] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const {
    location: { search },
  } = history;
  const { showPast } = parse(search, { parseBooleans: true });

  useEffect(() => {
    const pastShows = getPastActivities();
    setPast(pastShows);
    const upcomingShows = getAllUpcoming();
    setUpcoming(upcomingShows);
  }, [search, bookingsList, groupsList, currentUser]);

  const getAllUpcoming = () => {
    const allActivities = [
      ...getPublicActivities(bookingsList),
      ...getGroupMeetings(groupsList, currentUser),
    ];
    return allActivities.sort(compareForSort);
  };

  const getPastActivities = () => {
    return getPastPublicActivities(bookingsList).sort(compareForSortReverse);
  };

  const handlePastChange = ({ target: { value } }) => {
    const showPast = value === 'Past';
    history.push({ search: stringify({ showPast }) });
  };

  let thumbs;
  if (showPast) {
    thumbs = past;
  } else {
    thumbs = upcoming;
  }

  return (
    <div style={{ marginBottom: 48 }}>
      <Row gutter={24}>
        <div style={{ width: '100%' }}>
          {!thumbs || thumbs.length === 0 ? (
            <Loader />
          ) : (
            <div>
              <CovidInfo />
              <div style={centerStyle}>
                <RadioGroup
                  value={showPast ? 'Past' : 'Upcoming'}
                  options={['Past', 'Upcoming']}
                  onChange={handlePastChange}
                  optionType="button"
                  buttonStyle="solid"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {thumbs &&
                  thumbs.map((activity) => (
                    <SexyThumb
                      key={activity._id}
                      item={activity}
                      isHome
                      showPast={showPast}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </Row>
    </div>
  );
}

// const covidInfo = [
//   `Due to Covid-19 our public program is cancelled until september. In the fall we hope to see you all at Skogen again for more conversions, dinners and upcoming presentations of Frédéric Gies, Patricia Vane, Josefina Björk, Lisen Ellard & Mattias Lech, Ichi, Erik Sjögren & Joel Nordström, Sarah Vanhee, Tova Gerge & Britta Kiessling…`,
//   `We are curious to see how this is changing us all, and what kind of community and world we are able to build from here! We will continue to use Skogen to come together, to share resources, work and learn together.`,
//   `Until the fall Skogen is still open for Study groups, artists are working in the studio, books and zines are being printed in the press and we are making up plans for the future.`,
//   `Since our staff are on furlough, response to emails etc might be slower than usual.`,
//   `We miss you all here, take care, and have a good summer!`
// ];

// const covidInfo = [
//   `Skogen continues to be open. We are planning our autumn events for limited audiences, so we can maintain physical distance. We ask for anyone with symptoms of coronavirus to stay home.`,
//   `Because we will only have a limited number of seats, please cancel your booking if you cannot attend.`,
//   `Take care of each other, and welcome!`
// ];

const covidInfo = [
  `Skogen håller stängt till den 15e mars.`,
  `Skogen is closed until march 15th.`,
];

const innerBoxStyle = {
  margin: 12,
  padding: 12,
  maxWidth: 576,
  border: '1px solid #ea3924',
};

function CovidInfo() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={innerBoxStyle}>
        <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Notice</h3>
        {covidInfo.map((p) => (
          <p style={{ textAlign: 'center' }} key={p}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Home;

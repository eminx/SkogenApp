import React from 'react';
import moment from 'moment';
import { Row, List } from 'antd/lib';
import Loader from '../UIComponents/Loader';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';

const yesterday = moment(new Date()).add(-1, 'days');

const getFirstFutureOccurence = occurence =>
  moment(occurence.endDate).isAfter(yesterday);

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
  `Skogen håller stängt till den 19e nov.`,
  `Skogen is closed until nov 19th.`
];

class Home extends React.Component {
  state = {
    isUploading: false
  };

  getPublicActivities = () => {
    const { bookingsList } = this.props;
    if (!bookingsList) {
      return null;
    }

    const publicActivities = bookingsList.filter(
      activity => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter(activity =>
      activity.datesAndTimes.some(date =>
        moment(date.endDate).isAfter(yesterday)
      )
    );

    return futurePublicActivities;
  };

  parseOnlyAllowedGroups = futureGroups => {
    const { currentUser } = this.props;

    const futureGroupsAllowed = futureGroups.filter(group => {
      if (!group.isPrivate) {
        return true;
      } else {
        if (!currentUser) {
          return false;
        }
        const currentUserId = currentUser._id;
        return (
          group.adminId === currentUserId ||
          group.members.some(member => member.memberId === currentUserId) ||
          group.peopleInvited.some(
            person => person.email === currentUser.emails[0].address
          )
        );
      }
    });

    return futureGroupsAllowed;
  };

  getGroupMeetings = () => {
    const { groupsList } = this.props;
    if (!groupsList) {
      return null;
    }

    const futureGroups = groupsList.filter(group =>
      group.meetings.some(meeting =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    );

    const futureGroupsWithAccessFilter = this.parseOnlyAllowedGroups(
      futureGroups
    );

    return futureGroupsWithAccessFilter.map(group => ({
      ...group,
      datesAndTimes: group.meetings,
      isGroup: true
    }));
  };

  getAllSorted = () => {
    const allActitivities = [
      ...this.getPublicActivities(),
      ...this.getGroupMeetings()
    ];
    return allActitivities.sort(compareForSort);
  };

  render() {
    const { isLoading } = this.props;

    const allSortedActivities = this.getAllSorted();

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginBottom: 50
            }}
          >
            <div style={{ width: '100%' }}>
              {isLoading ? (
                <Loader />
              ) : (
                <div>
                  <div
                    style={{
                      margin: '0 auto',
                      marginBottom: 24,
                      padding: 12,
                      maxWidth: 576,
                      border: '1px solid #ea3924'
                    }}
                  >
                    <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Notice</h3>
                    {covidInfo.map(p => (
                      <p style={{ textAlign: 'center' }} key={p}>{p}</p>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}
                  >
                    {allSortedActivities.map(activity => (
                      <PublicActivityThumb
                        key={activity.title}
                        item={activity}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

export default Home;

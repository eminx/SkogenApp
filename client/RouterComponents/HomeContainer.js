import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';

export default HomeContainer = withTracker((props) => {
  const groupsSubscription = Meteor.subscribe('groups');
  const groupsList = Groups ? Groups.find().fetch() : null;

  const bookingsSubscription = Meteor.subscribe('gatherings', true);
  const isLoading =
    !bookingsSubscription.ready() || !groupsSubscription.ready();
  const bookingsList = Gatherings ? Gatherings.find().fetch() : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    bookingsList,
    currentUser,
    groupsList,
    history: props.history,
  };
})(Home);

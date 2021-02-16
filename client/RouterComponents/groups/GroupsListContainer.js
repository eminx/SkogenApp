import { withTracker } from 'meteor/react-meteor-data';
import GroupsList from './GroupsList';

export default GroupsListContainer = withTracker((props) => {
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(GroupsList);

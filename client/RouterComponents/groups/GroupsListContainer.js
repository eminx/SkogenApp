import { withTracker } from 'meteor/react-meteor-data';
import GroupsList from './GroupsList';

export default GroupsListContainer = withTracker((props) => {
  const currentUser = Meteor.user();
  groupsSub = Meteor.subscribe('groups');
  const groups = Groups ? Groups.find().fetch() : null;
  const loading = !groupsSub.ready();

  return {
    currentUser,
    groups,
    loading,
  };
})(GroupsList);

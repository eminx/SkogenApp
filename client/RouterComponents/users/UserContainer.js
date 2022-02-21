import { withTracker } from 'meteor/react-meteor-data';
import User from './User';

export default UserContainer = withTracker((props) => {
  const username = props.match.params.username;
  const currentUser = Meteor.user();
  const userSubscription = Meteor.subscribe('user', username);
  const user = Meteor.users ? Meteor.users.findOne({ username }) : null;
  // const userWorksSubscription = Meteor.subscribe('userWorks', username);
  // const userWorks = Works.find({ authorUsername: username }).fetch();
  const isLoading = !userSubscription.ready();

  return {
    isLoading,
    currentUser,
    user,
    // userWorks,
  };
})(User);

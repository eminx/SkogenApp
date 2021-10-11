import { Meteor } from 'meteor/meteor';

Meteor.methods({
  saveUserInfo(values) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(values.firstName, String);
    check(values.lastName, String);
    check(values.contactInfo, String);
    check(values.skogenAndMe, String);
    check(values.forCommunity, String);
    check(values.interestedIn, String);
    check(values.isPublic, Boolean);

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          contactInfo: values.contactInfo,
          skogenAndMe: values.skogenAndMe,
          forCommunity: values.forCommunity,
          interestedIn: values.interestedIn,
          isPublic: values.isPublic

        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setAvatar(avatar) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(user._id, {
        $set: {
          avatar: {
            src: avatar,
            date: new Date()
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Meteor.users.remove(userId);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  getCategories(type) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed');
    }

    return Categories.find({ type }).fetch();
  }
});

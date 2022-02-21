import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getPublicProfile(username) {
    const p = Meteor.users.findOne({
      username: username
    })

    if (!p) {
      throw new Meteor.Error('No user found');
    }

    if (!p.isPublic) {
      throw new Meteor.Error('Profile is not public');
    }

    return {
      avatar: p.avatar,
      contactInfo: p.contactInfo,
      firstName: p.firstName,
      forCommunity: p.forCommunity,
      lastName: p.lastName,
      username: p.username,
      images: p.images,
      skogenAndMe: p.skogenAndMe,
      interestedIn: p.interestedIn,
    }
  },

  getPublicProfiles() {
    try {
      const publicProfiles = Meteor.users.find({
        isPublic: true
      }).fetch();

      return publicProfiles.map(p => ({
        avatar: p.avatar,
        username: p.username,
        firstName: p.firstName, 
        lastName: p.lastName,
      }));
    } catch(error) {
      throw new Meteor.Error('Cannot retrieve public profiles')
    }

  },

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

  saveProfileImages(images) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(user._id, {
        $set: {
          images: images
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

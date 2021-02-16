const getVerifiedEmailText = (username) => {
  return `Hi ${username},\n\nWe're very happy to inform you that you are now a verified member at Skogen.\n\nThis means that from now on you're welcome to create your own study groups and book spaces & tools either for your own projects or to make a public event. We would like to encourage you to use this tool and wish you to keep a good collaboration with your team.\n\nKind regards,\nSkogen Team`;
};

const catColors = [
  'hsla(10, 62%, 40%, 0.9)',
  'hsla(46, 62%, 40%, 0.9)',
  'hsla(82, 62%, 40%, 0.9)',
  'hsla(118, 62%, 40%, 0.9)',
  'hsla(154, 62%, 40%, 0.9)',
  'hsla(190, 62%, 40%, 0.9)',
  'hsla(226, 62%, 40%, 0.9)',
  'hsla(262, 62%, 40%, 0.9)',
  'hsla(298, 62%, 40%, 0.9)',
  'hsla(334, 62%, 40%, 0.9)',
];

Meteor.methods({
  verifyMember(memberId) {
    const user = Meteor.user();
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const verifiedUser = Meteor.users.findOne(memberId);

    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: true,
        },
      });
      Meteor.call(
        'sendEmail',
        memberId,
        'You are now a verified member at Skogen',
        getVerifiedEmailText(verifiedUser.username)
      );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  unVerifyMember(memberId) {
    const user = Meteor.user();
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const theOtherUser = Meteor.users.findOne(memberId);
    if (theOtherUser.isSuperAdmin) {
      throw new Meteor.Error('You can not unverify a super admin');
    }

    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: false,
        },
      });
      Meteor.call(
        'sendEmail',
        memberId,
        'You are removed from Skogen as a verified member',
        `Hi,\n\nWe're sorry to inform you that you're removed as an active member at Skogen. You are, however, still welcome to participate to the events and groups here.\n\n For questions, please contact the admin.\n\nKind regards,\nSkogen Team`
      );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  getResources() {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      return Places.find().fetch();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  addResource(values) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const placesCounter = Places.find().count();

    if (Places.findOne({ name: values.name })) {
      throw new Meteor.Error('That place already exists!');
    }
    try {
      Places.insert({
        name: values.name,
        description: values.description || '',
        addedBy: Meteor.user().username,
        roomIndex: placesCounter,
        creationDate: new Date(),
      });
      return true;
    } catch (err) {
      throw new Meteor.Error(err, "Couldn't add the place : /");
    }
  },

  editResource(values, resourceId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      Places.update(resourceId, {
        $set: {
          name: values.name,
          description: values.description || '',
          lastUpdate: new Date(),
        },
      });
      return true;
    } catch (err) {
      throw new Meteor.Error(err, "Couldn't add the place : /");
    }
  },

  removeResource(resourceId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Places.remove(resourceId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  addNewCategory(category, type) {
    const user = Meteor.user();

    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    if (Categories.findOne({ label: category.toLowerCase() })) {
      throw new Meteor.Error('Category already exists!');
    }

    const catLength = Categories.find({ type }).count();

    try {
      return Categories.insert({
        type,
        label: category.toLowerCase(),
        color: catColors[catLength],
        addedBy: user._id,
        addedUsername: user.username,
        addedDate: new Date(),
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  removeCategory(categoryId) {
    const user = Meteor.user();

    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Categories.remove(categoryId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
